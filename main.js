const cohere = require('cohere-ai')
const jsdom = require('jsdom')
const htmlparser = require('htmlparser2')

cohere.init("apikey")

const isToxic = async (listOfStr) => {
  for(value of listOfStr){
    if (value.length > 2048){
      throw new Error("value too large")
    }
  }
  
  const response = await cohere.classify({
    inputs: listOfStr,
    model: "cohere-toxicity"
  })

  if(response.statusCode != 200){
    throw new Error("bad response")
  }

  return response.body.classifications.map((v) => {
    if(v.prediction === "TOXIC"){
      return true
    } else {
      return false
    }
  })

}


const parse = (htmlstr) => {
  const text = []
  dom = new jsdom.parseDocument(htmlstr)

  dom.window.document.body.querySelectorAll('span,p,h1,h2,h3,h4').forEach((v) => {
    const tname = v.tagName
    if(tname != "STYLE" && v.textContent){
      let content = v.textContent.trim()
      if(content.length > 0) {
        text.push(content)
      }
    }
  })
  return text
}

const parseYoutube = (document) => {
  const textList = [];
  /*
  const renderers = document.querySelectorAll(
    "yt-formatted-string.ytd-comment-renderer"
  );
  renderers.forEach((element) => {
    const text = element.textContent;
      if (text.length > 0) {
        textList.push(element.textContent);
      }
    });
*/
  let shouldBeRecorded = false
  const parser = new htmlparser.Parser({
    onopentag(name, attributes) {
      if(name == "yt-formatted-string" && attributes["class"] && attributes['class'].includes("comment")){
        shouldBeRecorded = true
      }
    },
    ontext(text) {
      const form = /^[0-9] (days|hours) ago$/
      if(shouldBeRecorded && !form.test(text)){
        textList.push(text)
      }

    },
    onclosetag(name) {
      shouldBeRecorded = false
    }
  })
  parser.write(document)
  parser.end()
  return [textList]
};

const censorString = (str, htmlstr) => {
  htmlstr.replace(str, "I love you!")
  return htmlstr
}


/**
 * text is a list of text
 */
const censorHtml = async (text) => {
  if(text.length > 2048) {
    return false
  }
  const toxicityList = await isToxic(text)
  toxicityList.forEach((value, index) => {
    if(value){
      html = censorString(text[index], html)
    }
  })
  return html
}

const timeSection = (f) => {
  const time = new Date().getTime()
  const res = f()
  const resultTime = new Date().getTime() - time
  return res
}

const censorYoutube = async (text) => {
  const [textList] = parseYoutube(text)
  const toxicity = await isToxic(textList)
  toxicity.forEach((v, index) => {
    
    if(v){
      text = text.replace(textList[index],"I love you")
    }
  })

  return text
}




fs = require('fs')
data = fs.readFile("youtubeExample.html", "utf8", (err, data) => {
  if(!err){
    censorYoutube(data).then((res) => {
      console.log(res)
    })
  } else {
    throw new Error(err.toString())
  }
})
