import { addRule, addRules, deleteRule, getRules, replaceRule } from "./rpc";
import "../css/options.css";
import els from "./elements";
import { id } from "./utils";

const getRW = (rule) =>
  typeof rule.rewrite === "object" ? rule.rewrite.target : rule.rewrite;

const makeRuleEntry =
  (btnName, onClick) =>
  (rule = {}, index = -1) => {
    const isControlRow = !("id" in rule);

    const entry = els.tr({ className: isControlRow ? "control" : "rule" });

    const btn = els.button(btnName, {
      disabled: true,
      className: "save",
    });
    const query = els.c.text(rule.match || "");
    const rewrite = els.c.text(getRW(rule) || "");
    const [exact, exactLabel] = els.c.checkbox(
      "exact-" + (index + 1),
      rule?.rewrite?.exact || false
    );

    entry.append(
      els.td(els.span(rule.id || "<id>")),
      els.td(query),
      els.td(rewrite),
      els.td(exact, exactLabel),
      els.td(btn, { colSpan: isControlRow ? 2 : 1 })
    );

    if (!isControlRow) {
      const del = els.button("Delete", {
        className: "delete",
        onclick: async () => {
          await deleteRule(rule.id);
          await refreshRules();
        },
      });
      entry.appendChild(els.td(del));
    }

    const updateButtonDisabledState = () => {
      if (isControlRow) {
        btn.disabled = !(query.value && rewrite.value);
      } else {
        btn.disabled =
          query.value == rule.match &&
          rewrite.value == getRW(rule) &&
          exact.checked == (rule?.rewrite?.exact || false);
      }
    };

    query.oninput = updateButtonDisabledState;
    rewrite.oninput = updateButtonDisabledState;
    exact.onchange = updateButtonDisabledState;

    btn.onclick = async () => {
      const clear = await onClick(
        query.value,
        rewrite.value,
        exact.checked,
        rule.id
      );
      if (clear) {
        query.value = "";
        rewrite.value = "";
      }
    };

    return entry;
  };

let previouslyFocusedElements = [];
let prevFocusOnModalOpen = null;

const refreshRules = async () => {
  const rules = await getRules();
  rules.sort((r1, r2) => r1.id - r2.id);
  const elems = rules.map(
    makeRuleEntry("Save", async (query, rewrite, exact, id) => {
      await replaceRule({
        id,
        match: { query },
        rewrite: { target: rewrite, exact },
      });
      await refreshRules();
    })
  );

  const controlRow = makeRuleEntry(
    "Add Rule",
    async (query, rewrite, exact) => {
      await addRule({ match: { query }, rewrite: { target: rewrite, exact } });
      await refreshRules();
      return true;
    }
  )();

  const rulesElement = document.getElementById("rules");
  while (rulesElement.lastElementChild) {
    rulesElement.removeChild(rulesElement.lastElementChild);
  }

  // Header row.
  rulesElement.appendChild(
    els.tr(...["ID", "Shortcut", "Target", "Exact?", "", ""].map(id(els.th)))
  );

  // Main table rows.
  rulesElement.append(controlRow, ...elems);

  // Import/export row.
  rulesElement.appendChild(
    els.tr(
      ...Array(4)
        .fill()
        .map(() => els.td()),
      els.td(els.button("Export", { id: "export", className: "save" })),
      els.td(els.button("Import", { id: "import", className: "save" }))
    )
  );

  let exportTimeoutId = null;
  document.getElementById("export").onclick = async function () {
    const result = await getRules();
    navigator.clipboard.writeText(JSON.stringify(result));
    this.textContent = "Exported!";

    clearTimeout(exportTimeoutId);
    exportTimeoutId = setTimeout(() => {
      exportTimeoutId = null;
      this.textContent = "Export";
    }, 500);
  };
  document.getElementById("import").onclick = async () => {
    prevFocusOnModalOpen =
      previouslyFocusedElements[previouslyFocusedElements.length - 1];
    document.body.classList.add("modalOpen");
    document.getElementById("rules").setAttribute("aria-hidden", "true");
    document.getElementById("importModal").style.display = "flex";
    document.getElementById("importModal").setAttribute("aria-modal", "true");
    document.getElementById("importText").focus();
  };
};

document.body.onload = async () => {
  document.body.addEventListener("focusin", (e) => {
    previouslyFocusedElements.unshift(e.target);
    if (previouslyFocusedElements.length > 2) {
      previouslyFocusedElements.pop();
    }
  });

  await refreshRules();

  const importText = document.getElementById("importText");
  const importError = document.getElementById("importError");
  const importDiscard = document.getElementById("importDiscard");
  const importConfirm = document.getElementById("importConfirm");
  const importModal = document.getElementById("importModal");

  const closeModal = () => {
    window.getSelection().removeAllRanges();
    document.body.classList.remove("modalOpen");
    importModal.style.display = "none";
    importModal.setAttribute("aria-modal", "false");
    document.getElementById("rules").setAttribute("aria-hidden", "false");
    importText.value = "";
    importError.setAttribute("role", undefined);
    importError.style.display = "none";
    importConfirm.disabled = true;
    previouslyFocusedElements = [];
    prevFocusOnModalOpen?.focus();
    prevFocusOnModalOpen = null;
  };

  importDiscard.onclick = closeModal;
  importConfirm.onclick = async () => {
    const importJSON = document.getElementById("importText").value;
    if (!importJSON) return;

    try {
      await addRules(JSON.parse(importJSON));
      await refreshRules();

      closeModal();
    } catch (e) {
      importError.setAttribute("role", "alert");
      importError.style.display = "inline-block";
      throw e;
    }
  };

  importText.oninput = () => {
    importConfirm.disabled = !importText.value;
  };

  importText.onkeydown = (e) => {
    if (e.ctrlKey || e.altKey | e.metaKey) return;
    if (e.key === "Tab" && e.shiftKey) {
      (importConfirm.disabled ? importDiscard : importConfirm).focus();
      e.preventDefault();
      return false;
    }
    if (e.key === "Escape") {
      importText.blur();
      e.stopPropagation();
    }
  };
  importDiscard.onkeydown = (e) => {
    if (e.ctrlKey || e.altKey | e.metaKey) return;
    if (e.key === "Tab" && !e.shiftKey && importConfirm.disabled) {
      importText.focus();
      e.preventDefault();
      return false;
    }
  };
  importConfirm.onkeydown = (e) => {
    if (e.ctrlKey || e.altKey | e.metaKey) return;
    if (e.key === "Tab" && !e.shiftKey) {
      importText.focus();
      e.preventDefault();
      return false;
    }
  };

  let ignoreClickCount = 0;
  importModal.onmousedown = function (e) {
    ignoreClickCount += e.target !== this;
  };
  importModal.onmouseup = function (e) {
    if (e.target !== this || ignoreClickCount) {
      ignoreClickCount = Math.max(ignoreClickCount - 1, 0);
      return;
    }
    closeModal();
  };
  document.onkeydown = function (e) {
    if (e.key === "Escape" && document.body.classList.contains("modalOpen")) {
      closeModal();
    }
  };
};
