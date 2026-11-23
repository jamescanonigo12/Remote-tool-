/*
 * app.js - rendering, navigation, search, progress and theme for the guide.
 * Plain JavaScript, no frameworks, no build step.
 */
(function () {
  "use strict";

  var GUIDE = window.GUIDE;
  var ART = window.RemoteGuideArt;
  var OS = GUIDE.osList;
  var STORE_KEY = "remote-tool-guide:v1";

  var state = {
    toolId: GUIDE.tools[0].id,
    os: "windows",
    theme: "light",
    done: {},
    query: "",
    results: [],
    cursor: -1
  };

  /* ------------------------------------------------------------------ */
  /* helpers                                                             */
  /* ------------------------------------------------------------------ */

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function md(value) {
    return esc(value)
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>')
      .replace(/`(.+?)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-slate-800 dark:text-slate-100">$1</code>')
      .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em class="italic">$2</em>');
  }

  function plain(value) {
    return String(value).replace(/\*\*/g, "").replace(/`/g, "").replace(/\*/g, "");
  }

  function svg(paths, cls, extra) {
    return (
      '<svg class="' + (cls || "h-4 w-4") + '" viewBox="0 0 24 24" aria-hidden="true" ' +
      (extra || 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"') +
      ">" + paths + "</svg>"
    );
  }

  var ICONS = {
    windows: svg('<path d="M3 5.6 10.4 4.5v6.9H3zM12 4.2 21 3v8.4h-9zM3 13h7.4v6.9L3 18.8zM12 13h9v8.4l-9-1.2z" fill="currentColor" stroke="none"/>'),
    mac: svg('<path d="M16.2 12.6c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.6 0-1.6-.8-2.6-.8-1.3 0-2.5.8-3.2 1.9-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.6 2 1 0 1.4-.7 2.6-.7 1.2 0 1.5.7 2.6.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-2.9zM14.1 6.4c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.5-.9 2.4.9.1 1.8-.4 2.5-1.1z" fill="currentColor" stroke="none"/>'),
    chromeos: svg('<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 3.4v5.2M20.6 12h-5.2M12 20.6v-5.2M3.4 12h5.2" stroke="currentColor" stroke-width="1.7"/>'),
    search: svg('<circle cx="11" cy="11" r="6.8"/><path d="M20.5 20.5 16 16"/>'),
    sun: svg('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>'),
    moon: svg('<path d="M20 14.4A8.4 8.4 0 1 1 9.6 4a6.9 6.9 0 0 0 10.4 10.4z"/>'),
    print: svg('<path d="M7 9V3.8h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14.5h10v5.7H7z"/>'),
    check: svg('<path d="M5 12.5l4.2 4.3L19 6.8"/>', "h-3.5 w-3.5"),
    info: svg('<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.2M12 7.8v.2"/>'),
    alert: svg('<path d="M12 3.8 21 20H3z"/><path d="M12 9.6v4.6M12 17.2v.2"/>'),
    external: svg('<path d="M14 4.5h5.5V10M19.5 4.5 11 13"/><path d="M18.5 14.5v4a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5h4"/>'),
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2.4"/><path d="M15 6.2V5.4A1.4 1.4 0 0 0 13.6 4H5.4A1.4 1.4 0 0 0 4 5.4v8.2A1.4 1.4 0 0 0 5.4 15h.8"/>'),
    phone: svg('<path d="M6.4 3.8h3l1.4 3.6-2 1.4a11 11 0 0 0 5.4 5.4l1.4-2 3.6 1.4v3a1.8 1.8 0 0 1-2 1.8A15.5 15.5 0 0 1 4.6 5.8a1.8 1.8 0 0 1 1.8-2z"/>'),
    arrow: svg('<path d="M5 12h14M14 7l5 5-5 5"/>')
  };

  function toolById(id) {
    for (var i = 0; i < GUIDE.tools.length; i += 1) {
      if (GUIDE.tools[i].id === id) return GUIDE.tools[i];
    }
    return GUIDE.tools[0];
  }

  /* ------------------------------------------------------------------ */
  /* storage                                                             */
  /* ------------------------------------------------------------------ */

  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved.done) state.done = saved.done;
      if (saved.theme === "dark" || saved.theme === "light") state.theme = saved.theme;
      if (saved.toolId) state.toolId = saved.toolId;
      if (saved.os) state.os = saved.os;
    } catch (err) {
      /* storage unavailable - ignore */
    }
  }

  function save() {
    try {
      window.localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          done: state.done,
          theme: state.theme,
          toolId: state.toolId,
          os: state.os
        })
      );
    } catch (err) {
      /* ignore */
    }
  }

  /* ------------------------------------------------------------------ */
  /* state helpers                                                       */
  /* ------------------------------------------------------------------ */

  function doneSet(toolId, os) {
    if (!state.done[toolId]) state.done[toolId] = {};
    if (!state.done[toolId][os]) state.done[toolId][os] = [];
    return state.done[toolId][os];
  }

  function stepsOf(tool, os) {
    return tool.steps[os] || [];
  }

  function isDone(toolId, os, index) {
    return doneSet(toolId, os).indexOf(index) !== -1;
  }

  /* ------------------------------------------------------------------ */
  /* theme                                                               */
  /* ------------------------------------------------------------------ */

  function applyTheme() {
    var root = document.documentElement;
    if (state.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    var btn = document.getElementById("themeToggle");
    if (btn) {
      btn.innerHTML = state.theme === "dark" ? ICONS.sun : ICONS.moon;
      btn.setAttribute(
        "aria-label",
        state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      btn.setAttribute("title", btn.getAttribute("aria-label"));
    }
  }

  /* ------------------------------------------------------------------ */
  /* sidebar                                                             */
  /* ------------------------------------------------------------------ */

  function renderToolList() {
    var list = document.getElementById("toolList");
    list.innerHTML = GUIDE.tools
      .map(function (tool) {
        var active = tool.id === state.toolId;
        return (
          '<button type="button" data-tool="' + tool.id + '" aria-pressed="' + active + '" ' +
          'class="group flex w-56 shrink-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition lg:w-full ' +
          (active
            ? "border-slate-300 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900"
            : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white/70 dark:hover:border-slate-800 dark:hover:bg-slate-900/60") +
          '">' +
          '<span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-white" style="background:' +
          tool.accent +
          '">' +
          esc(tool.initials) +
          "</span>" +
          '<span class="min-w-0 flex-1">' +
          '<span class="block truncate text-sm font-semibold ' +
          (active ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300") +
          '">' +
          esc(tool.name) +
          "</span>" +
          '<span class="hidden truncate text-[11px] text-slate-500 lg:block dark:text-slate-400">' +
          esc(tool.tagline) +
          "</span>" +
          "</span>" +
          (active ? '<span class="h-6 w-1 rounded-full" style="background:' + tool.accent + '"></span>' : "") +
          "</button>"
        );
      })
      .join("");
  }

  /* ------------------------------------------------------------------ */
  /* view                                                                */
  /* ------------------------------------------------------------------ */

  function downloadFor(tool, os) {
    return (
      (tool.downloads && tool.downloads[os]) || { url: tool.official, label: "Official website" }
    );
  }

  function headerHtml(tool, os, steps) {
    var done = doneSet(tool.id, os).length;
    var total = steps.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    var download = downloadFor(tool, os);
    var limit = tool.limits && tool.limits[os];
    var badges = "";

    if (limit) {
      badges +=
        '<span class="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900">' +
        ICONS.alert +
        "Not available</span>";
    }
    if (tool.verify) {
      badges +=
        '<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900">' +
        ICONS.info +
        "Confirm with IT</span>";
    }
    badges +=
      '<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">' +
      ICONS[os] +
      esc(osName(os)) +
      "</span>";

    return (
      '<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6 dark:border-slate-800 dark:bg-slate-900">' +
      '<div class="flex flex-wrap items-start gap-4">' +
      '<span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white shadow-sm" style="background:' +
      tool.accent +
      '">' +
      esc(tool.initials) +
      "</span>" +
      '<div class="min-w-0 flex-1">' +
      '<div class="flex flex-wrap items-center gap-2">' +
      '<h1 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">' +
      esc(tool.name) +
      "</h1>" +
      badges +
      "</div>" +
      '<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">' +
      esc(tool.tagline) +
      "</p>" +
      '<p class="mt-1 text-xs text-slate-500 dark:text-slate-500">Vendor: ' +
      esc(tool.vendor) +
      "</p>" +
      "</div>" +
      '<div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">' +
      '<a href="' +
      esc(download.url) +
      '" target="_blank" rel="noopener noreferrer" ' +
      'class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" ' +
      'style="background:' +
      tool.accent +
      '">' +
      ICONS.arrow +
      esc(download.label) +
      "</a>" +
      '<a href="' +
      esc(tool.official) +
      '" target="_blank" rel="noopener noreferrer" ' +
      'class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">' +
      ICONS.external +
      "Official site</a>" +
      "</div>" +
      "</div>" +
      '<p class="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">' +
      md(tool.summary) +
      "</p>" +
      (tool.requirements
        ? '<ul class="mt-3 flex flex-wrap gap-2 text-[12px] text-slate-600 dark:text-slate-400">' +
          tool.requirements
            .map(function (r) {
              return (
                '<li class="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">' +
                '<span class="h-1.5 w-1.5 rounded-full" style="background:' +
                tool.accent +
                '"></span>' +
                esc(r) +
                "</li>"
              );
            })
            .join("") +
          "</ul>"
        : "") +
      '<div class="mt-5">' +
      '<div class="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">' +
      '<span>Progress</span>' +
      '<span id="progressLabel">' +
      done +
      " of " +
      total +
      " steps done</span>" +
      "</div>" +
      '<div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">' +
      '<div id="progressBar" class="h-full rounded-full transition-all duration-300" style="width:' +
      pct +
      "%;background:" +
      tool.accent +
      '"></div>' +
      "</div>" +
      "</div>" +
      (tool.note
        ? '<p class="mt-4 flex gap-2 rounded-xl bg-sky-50 p-3 text-[13px] leading-relaxed text-sky-900 ring-1 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-900">' +
          '<span class="mt-0.5 shrink-0">' +
          ICONS.info +
          "</span><span>" +
          md(tool.note) +
          "</span></p>"
        : "") +
      "</section>"
    );
  }

  function osName(id) {
    for (var i = 0; i < OS.length; i += 1) if (OS[i].id === id) return OS[i].name;
    return id;
  }

  function tabsHtml(tool, os) {
    return (
      '<div role="tablist" aria-label="Operating system" class="no-print mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900">' +
      OS.map(function (item) {
        var active = item.id === os;
        var limit = tool.limits && tool.limits[item.id];
        return (
          '<button type="button" role="tab" data-os="' +
          item.id +
          '" aria-selected="' +
          active +
          '" class="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ' +
          (active
            ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
            : "text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white") +
          '">' +
          '<span class="' +
          (active ? "opacity-100" : "opacity-70") +
          '">' +
          ICONS[item.id] +
          "</span>" +
          esc(item.short) +
          (limit
            ? '<span class="rounded-full bg-rose-100 px-1.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">!</span>'
            : "") +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function limitHtml(tool, os) {
    var limit = tool.limits && tool.limits[os];
    if (!limit) return "";
    var alt = toolById(limit.alt);
    return (
      '<section class="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/40">' +
      '<div class="flex gap-3">' +
      '<span class="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400">' +
      ICONS.alert +
      "</span>" +
      '<div class="min-w-0">' +
      '<h2 class="text-sm font-bold text-rose-900 dark:text-rose-200">' +
      esc(tool.name) +
      " does not run on " +
      esc(osName(os)) +
      "</h2>" +
      '<p class="mt-1 text-sm leading-relaxed text-rose-800 dark:text-rose-300">' +
      md(limit.reason) +
      "</p>" +
      '<button type="button" data-goto="' +
      alt.id +
      '" data-goto-os="' +
      os +
      '" class="mt-3 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">' +
      "Open the " +
      esc(alt.name) +
      " guide for " +
      esc(osName(os)) +
      ICONS.arrow +
      "</button>" +
      "</div></div></section>"
    );
  }

  function artHtml(step, accent) {
    if (!step.art && !step.img) return "";
    var inner;
    if (step.img) {
      inner =
        '<img src="' +
        esc(step.img) +
        '" alt="' +
        esc(step.title) +
        '" loading="lazy" class="block w-full rounded-lg" />';
    } else {
      inner = ART.render(step.art, accent);
    }
    return (
      '<figure class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">' +
      '<div class="art-wrap p-2 sm:p-3">' +
      inner +
      "</div>" +
      '<figcaption class="border-t border-slate-200 px-3 py-1.5 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">' +
      "Illustration — your screen may look slightly different" +
      "</figcaption>" +
      "</figure>"
    );
  }

  function stepHtml(step, index, tool, os) {
    var done = isDone(tool.id, os, index);
    return (
      '<li id="step-' +
      tool.id +
      "-" +
      os +
      "-" +
      index +
      '" class="step scroll-mt-24 rounded-2xl border bg-white p-4 transition sm:p-5 ' +
      (done
        ? "border-slate-300 opacity-80 dark:border-slate-700"
        : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700") +
      ' dark:bg-slate-900" data-step="' +
      index +
      '">' +
      '<div class="flex gap-3 sm:gap-4">' +
      '<span class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white" style="background:' +
      tool.accent +
      '">' +
      (index + 1) +
      "</span>" +
      '<div class="min-w-0 flex-1">' +
      '<div class="flex items-start justify-between gap-3">' +
      '<h3 class="text-[15px] font-semibold leading-snug text-slate-900 sm:text-base dark:text-white">' +
      md(step.title) +
      "</h3>" +
      '<button type="button" data-done="' +
      index +
      '" aria-pressed="' +
      done +
      '" title="' +
      (done ? "Mark as not done" : "Mark as done") +
      '" class="no-print grid h-7 w-7 shrink-0 place-items-center rounded-full border transition ' +
      (done
        ? "border-transparent text-white"
        : "border-slate-300 text-transparent hover:border-slate-400 dark:border-slate-600") +
      '" style="' +
      (done ? "background:" + tool.accent : "") +
      '">' +
      ICONS.check +
      "</button>" +
      "</div>" +
      '<p class="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">' +
      md(step.body || "") +
      "</p>" +
      (step.note
        ? '<p class="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-[13px] leading-relaxed text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900">' +
          '<span class="mt-0.5 shrink-0">' +
          ICONS.info +
          "</span><span>" +
          md(step.note) +
          "</span></p>"
        : "") +
      (step.code
        ? '<div class="relative mt-3">' +
          '<pre class="overflow-x-auto rounded-xl bg-slate-900 px-3 py-3 pr-20 text-[12.5px] leading-relaxed text-slate-100"><code>' +
          esc(step.code) +
          "</code></pre>" +
          '<button type="button" data-copy="' +
          esc(step.code) +
          '" class="no-print absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-600">' +
          ICONS.copy +
          "Copy</button>" +
          "</div>"
        : "") +
      artHtml(step, tool.accent) +
      "</div></div></li>"
    );
  }

  function stepsHtml(tool, os) {
    var steps = stepsOf(tool, os);
    if (!steps.length) {
      return (
        '<p class="mt-5 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">' +
        "No steps published for this platform yet — contact IT.</p>"
      );
    }
    return (
      '<div class="mt-5 flex items-center justify-between">' +
      '<h2 class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      esc(osName(os)) +
      " · " +
      steps.length +
      " steps</h2>" +
      '<button type="button" data-reset class="no-print text-[11px] font-semibold text-slate-500 underline decoration-dotted underline-offset-2 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">Reset progress</button>' +
      "</div>" +
      '<ol class="mt-3 space-y-3">' +
      steps
        .map(function (step, index) {
          return stepHtml(step, index, tool, os);
        })
        .join("") +
      "</ol>"
    );
  }

  function renderView() {
    var tool = toolById(state.toolId);
    var os = state.os;
    var steps = stepsOf(tool, os);
    var view = document.getElementById("view");
    view.innerHTML =
      headerHtml(tool, os, steps) +
      '<p class="no-print mt-4 flex items-start gap-2 px-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">' +
      '<span class="mt-0.5 shrink-0">' +
      ICONS.info +
      "</span>" +
      "<span>Pick your operating system below, then follow the numbered steps in order. " +
      "Tick a step when it is done — progress is saved on this device.</span></p>" +
      tabsHtml(tool, os) +
      limitHtml(tool, os) +
      stepsHtml(tool, os);
  }

  /* ------------------------------------------------------------------ */
  /* progress                                                            */
  /* ------------------------------------------------------------------ */

  function updateProgress() {
    var tool = toolById(state.toolId);
    var os = state.os;
    var total = stepsOf(tool, os).length;
    var done = doneSet(tool.id, os).length;
    var bar = document.getElementById("progressBar");
    var label = document.getElementById("progressLabel");
    if (bar) bar.style.width = (total ? Math.round((done / total) * 100) : 0) + "%";
    if (label) label.textContent = done + " of " + total + " steps done";
  }

  function toggleDone(index, button) {
    var tool = toolById(state.toolId);
    var list = doneSet(tool.id, state.os);
    var at = list.indexOf(index);
    if (at === -1) list.push(index);
    else list.splice(at, 1);
    save();

    var step = document.getElementById("step-" + tool.id + "-" + state.os + "-" + index);
    var nowDone = at === -1;
    if (step) {
      step.classList.toggle("opacity-80", nowDone);
      step.classList.toggle("border-slate-300", nowDone);
      step.classList.toggle("dark:border-slate-700", nowDone);
      step.classList.toggle("border-slate-200", !nowDone);
      step.classList.toggle("dark:border-slate-800", !nowDone);
    }
    if (button) {
      button.setAttribute("aria-pressed", String(nowDone));
      button.title = nowDone ? "Mark as not done" : "Mark as done";
      if (nowDone) {
        button.style.background = tool.accent;
        button.style.borderColor = "transparent";
        button.style.color = "#ffffff";
      } else {
        button.style.background = "";
        button.style.borderColor = "";
        button.style.color = "";
      }
    }
    updateProgress();
  }

  /* ------------------------------------------------------------------ */
  /* navigation                                                          */
  /* ------------------------------------------------------------------ */

  function select(toolId, os, stepIndex) {
    state.toolId = toolById(toolId).id;
    if (os) state.os = os;
    if (!toolById(toolId).steps[state.os]) state.os = "windows";
    state.query = "";
    document.getElementById("search").value = "";
    document.getElementById("results").classList.add("hidden");
    state.cursor = -1;
    renderToolList();
    renderView();
    save();
    try {
      window.history.replaceState(null, "", "#" + state.toolId + "/" + state.os);
    } catch (err) {
      /* ignore */
    }
    if (typeof stepIndex === "number") {
      window.setTimeout(function () {
        var el = document.getElementById("step-" + state.toolId + "-" + state.os + "-" + stepIndex);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function readHash() {
    var hash = (window.location.hash || "").replace(/^#\/?/, "");
    if (!hash) return false;
    var parts = hash.split("/");
    var tool = toolById(parts[0]);
    if (parts[0] !== tool.id && !GUIDE.tools.some(function (t) { return t.id === parts[0]; })) {
      return false;
    }
    var os = parts[1];
    if (!os || !tool.steps[os]) os = "windows";
    state.toolId = tool.id;
    state.os = os;
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* search                                                              */
  /* ------------------------------------------------------------------ */

  function buildIndex() {
    var index = [];
    GUIDE.tools.forEach(function (tool) {
      OS.forEach(function (os) {
        stepsOf(tool, os.id).forEach(function (step, i) {
          index.push({
            toolId: tool.id,
            toolName: tool.name,
            accent: tool.accent,
            os: os.id,
            osName: os.name,
            index: i,
            title: step.title,
            text: plain(step.body || "") + " " + plain(step.note || "")
          });
        });
      });
    });
    return index;
  }

  var SEARCH = [];

  function search(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    var words = q.split(/\s+/);
    return SEARCH.filter(function (item) {
      var haystack = (item.toolName + " " + item.osName + " " + item.title + " " + item.text).toLowerCase();
      return words.every(function (w) {
        return haystack.indexOf(w) !== -1;
      });
    }).slice(0, 8);
  }

  function renderResults() {
    var box = document.getElementById("results");
    state.results = search(state.query);
    state.cursor = -1;
    if (!state.query.trim()) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }
    if (!state.results.length) {
      box.classList.remove("hidden");
      box.innerHTML =
        '<p class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No steps match “' +
        esc(state.query) +
        '”. Try a tool name like <strong>anydesk</strong> or a word like <strong>password</strong>.</p>';
      return;
    }
    box.classList.remove("hidden");
    box.innerHTML =
      '<p class="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Matches</p>' +
      state.results
        .map(function (item, i) {
          return (
            '<button type="button" data-result="' +
            i +
            '" class="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800">' +
            '<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" style="background:' +
            item.accent +
            '"></span>' +
            '<span class="min-w-0">' +
            '<span class="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">' +
            esc(item.toolName) +
            ' <span class="font-normal text-slate-400">·</span> <span class="font-normal text-slate-500 dark:text-slate-400">' +
            esc(item.osName) +
            "</span></span>" +
            '<span class="block truncate text-[12px] text-slate-500 dark:text-slate-400">' +
            esc(item.title) +
            "</span>" +
            "</span>" +
            "</button>"
          );
        })
        .join("");
  }

  function highlightCursor() {
    var items = document.querySelectorAll("[data-result]");
    for (var i = 0; i < items.length; i += 1) {
      if (i === state.cursor) items[i].classList.add("bg-slate-100", "dark:bg-slate-800");
      else items[i].classList.remove("bg-slate-100", "dark:bg-slate-800");
    }
  }

  /* ------------------------------------------------------------------ */
  /* events                                                              */
  /* ------------------------------------------------------------------ */

  function copyText(text, button) {
    var done = function () {
      if (!button) return;
      var original = button.innerHTML;
      button.innerHTML = ICONS.check + "Copied";
      window.setTimeout(function () {
        button.innerHTML = original;
      }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "readonly");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      done();
    } catch (err) {
      /* ignore */
    }
    document.body.removeChild(area);
  }

  function bind() {
    document.getElementById("toolList").addEventListener("click", function (event) {
      var btn = event.target.closest("[data-tool]");
      if (btn) select(btn.getAttribute("data-tool"));
    });

    document.getElementById("view").addEventListener("click", function (event) {
      var osBtn = event.target.closest("[data-os]");
      if (osBtn) {
        select(state.toolId, osBtn.getAttribute("data-os"));
        return;
      }
      var doneBtn = event.target.closest("[data-done]");
      if (doneBtn) {
        toggleDone(parseInt(doneBtn.getAttribute("data-done"), 10), doneBtn);
        return;
      }
      var copyBtn = event.target.closest("[data-copy]");
      if (copyBtn) {
        copyText(copyBtn.getAttribute("data-copy"), copyBtn);
        return;
      }
      if (event.target.closest("[data-reset]")) {
        if (!state.done[state.toolId]) state.done[state.toolId] = {};
        state.done[state.toolId][state.os] = [];
        save();
        renderView();
        return;
      }
      var goto = event.target.closest("[data-goto]");
      if (goto) {
        select(goto.getAttribute("data-goto"), goto.getAttribute("data-goto-os"));
      }
    });

    var input = document.getElementById("search");
    input.addEventListener("input", function () {
      state.query = input.value;
      renderResults();
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        input.value = "";
        state.query = "";
        renderResults();
        input.blur();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        if (state.results.length) {
          var pick = state.results[state.cursor >= 0 ? state.cursor : 0];
          select(pick.toolId, pick.os, pick.index);
        }
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (!state.results.length) return;
        event.preventDefault();
        var dir = event.key === "ArrowDown" ? 1 : -1;
        state.cursor = (state.cursor + dir + state.results.length) % state.results.length;
        highlightCursor();
      }
    });

    document.getElementById("results").addEventListener("click", function (event) {
      var btn = event.target.closest("[data-result]");
      if (!btn) return;
      var item = state.results[parseInt(btn.getAttribute("data-result"), 10)];
      if (item) select(item.toolId, item.os, item.index);
    });

    document.getElementById("themeToggle").addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
      save();
    });

    document.getElementById("printBtn").addEventListener("click", function () {
      window.print();
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest("#search") && !event.target.closest("#results")) {
        document.getElementById("results").classList.add("hidden");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "/" && document.activeElement !== document.getElementById("search")) {
        event.preventDefault();
        document.getElementById("search").focus();
      }
    });

    window.addEventListener("hashchange", function () {
      if (readHash()) {
        renderToolList();
        renderView();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* footer                                                              */
  /* ------------------------------------------------------------------ */

  function renderFooter() {
    var help = GUIDE.meta.help;
    document.getElementById("helpPhone").textContent = help.phone;
    document.getElementById("helpEmail").textContent = help.email;
    document.getElementById("helpHours").textContent = help.hours;
    document.getElementById("updatedAt").textContent = GUIDE.meta.updated;
  }

  /* ------------------------------------------------------------------ */
  /* init                                                                */
  /* ------------------------------------------------------------------ */

  function init() {
    load();
    if (!readHash()) {
      if (!toolById(state.toolId).steps[state.os]) state.os = "windows";
    }
    SEARCH = buildIndex();
    applyTheme();
    renderToolList();
    renderFooter();
    renderView();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();