import React, { Suspense, lazy } from 'react';
import { AppPlugin, type AppRootProps } from '@grafana/data';
import { LoadingPlaceholder } from '@grafana/ui';
import { tokens } from './tokens';
import { LOGO_BASE64 } from './logo';

// ─── Theme injection ────────────────────────────────────────────────────────

function keepStyleLast(): void {
  const observer = new MutationObserver(() => {
    const style = document.getElementById('voltigo-theme');
    if (!style) { return; }
    if (document.head.lastElementChild !== style) {
      document.head.appendChild(style);
    }
  });
  observer.observe(document.head, { childList: true });
}

function injectTheme(): void {
  if (document.getElementById('voltigo-theme')) {
    return;
  }

  const t = tokens.color;
  const style = document.createElement('style');
  style.id = 'voltigo-theme';
  style.textContent = `
    /* ── Font (Roboto) ───────────────────────────────────────────── */
    body, button, input, textarea, select, a, span, div {
      font-family: Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    }

    /* ── Backgrounds ─────────────────────────────────────────────── */
    body,
    [class$="-page-wrapper"],
    .main-view {
      background-color: ${t.background} !important;
    }

    /* ── Global toolbar ──────────────────────────────────────────── */
    [data-testid="data-testid Nav toolbar"],
    [class*="navbar-"] {
      background-color: ${t.background} !important;
      border-bottom: none !important;
    }

    [data-testid="data-testid Nav toolbar"]:has([data-testid="data-testid Edit dashboard button"]) {
      background-color: ${t.background} !important;
      border-bottom: 1px solid ${t.border} !important;
    }

    [data-testid="data-testid Command palette trigger"],
    button[class$="-input-input"] {
      background-color: ${t.background} !important;
      border-color: ${t.border} !important;
      color: ${t.textMuted} !important;
    }

    /* ── Dashboard controls bar ──────────────────────────────────── */
    [data-testid="data-testid dashboard controls"],
    [data-testid="data-testid Dashboard controls"] {
      background-color: ${t.surface} !important;
      border-bottom: none !important;
    }

    div:has(> [data-testid="data-testid dashboard controls"]),
    div:has(> [data-testid="data-testid Dashboard controls"]) {
      background-color: ${t.surface} !important;
      border-bottom: 1px solid ${t.border} !important;
    }

    /* ── Sidebar ─────────────────────────────────────────────────── */
    .sidemenu,
    [data-testid="sidemenu"],
    [class*="sidemenu-"],
    nav[class*="sidemenu"],
    [data-testid="data-testid navigation mega-menu"] {
      background-color: ${t.surface} !important;
    }

    [data-testid="data-testid Nav menu item"]:hover {
      background-color: ${t.surfaceHover} !important;
    }

    [data-testid="data-testid Nav menu item"][aria-current="page"],
    [data-testid="data-testid Nav menu item"][aria-current="page"] *,
    nav [aria-current="page"] {
      color: ${t.primary} !important;
      border-left-color: ${t.primary} !important;
    }

    li:has(> div > [data-testid="data-testid Nav menu item"][aria-current="page"])::before,
    li:has(> [data-testid="data-testid Nav menu item"][aria-current="page"])::before,
    div:has(> [data-testid="data-testid Nav menu item"][aria-current="page"])::before,
    div:has(> a[aria-current="page"])::before {
      background: ${t.primary} !important;
      border-color: ${t.primary} !important;
    }

    /* ── Panels ──────────────────────────────────────────────────── */
    .panel-container,
    [class$="-panel-container"] {
      background-color: ${t.surface} !important;
      border: 1px solid ${t.border} !important;
    }

    .panel-title { color: ${t.text} !important; }

    .dashboard-row {
      background-color: transparent !important;
      border-top: 1px solid ${t.border} !important;
    }

    /* ── Buttons ─────────────────────────────────────────────────── */
    button[class$="-button"]:not([aria-label*="Close"]):not([aria-label*="close"]):not([aria-label*="Cancel"]):not([aria-label*="Dismiss"]):not([aria-label*="Remove"]):not([aria-label*="Delete"]):not([data-testid*="collapse"]):not([class*="react-calendar__navigation"]):not([aria-label="Collapse outline"]) {
      background-color: ${t.primary} !important;
      border-color: ${t.primary} !important;
      color: #fff !important;
    }

    button[class$="-button"]:not([aria-label="Collapse outline"]):hover {
      background-color: ${t.primaryHover} !important;
      border-color: ${t.primaryHover} !important;
    }

    .btn-primary {
      background-color: ${t.primary} !important;
      border-color: ${t.primary} !important;
      color: #fff !important;
    }

    /* ── CSS variables ───────────────────────────────────────────── */
    :root {
      --primary-color: ${t.primary} !important;
      --color-primary-main: ${t.primary} !important;
      --color-primary-border: ${t.primary} !important;
      --color-primary-text: ${t.primary} !important;
      --color-primary-shade: ${t.primaryHover} !important;
      --color-primary-transparent: ${t.primary}22 !important;
    }

    [aria-selected="true"],
    [aria-checked="true"],
    [class*="activeLink-"] { color: ${t.primary} !important; }

    /* ── Nav text ────────────────────────────────────────────────── */
    nav a,
    [data-testid*="Nav menu item"],
    [data-testid*="Nav menu item"] *,
    [data-testid*="Nav menu item"]:not([aria-current="page"]),
    [data-testid*="Nav menu item"]:not([aria-current="page"]) * {
      color: ${t.text} !important;
    }

    [aria-label="Breadcrumb"] a,
    [class*="breadcrumb"] a { color: ${t.text} !important; }

    /* ── Modals / drawers / menus ────────────────────────────────── */
    [role="dialog"],
    [class*="drawer-"] {
      background-color: ${t.surface} !important;
      border: 1px solid ${t.border} !important;
    }

    [role="menu"],
    [role="listbox"] {
      background-color: ${t.surface} !important;
      border: 1px solid ${t.border} !important;
    }

    [role="menuitem"]:hover,
    [role="option"]:hover { background-color: ${t.surfaceHover} !important; }

    /* ── Inputs ──────────────────────────────────────────────────── */
    input:not([role="combobox"]),
    textarea,
    select {
      background-color: ${t.surface} !important;
      border-color: ${t.border} !important;
      color: ${t.text} !important;
    }

    input[role="combobox"] {
      background-color: transparent !important;
      color: ${t.text} !important;
    }

    input:focus,
    textarea:focus {
      border-color: ${t.primary} !important;
      outline: none !important;
      box-shadow: 0 0 0 2px ${t.primary}33 !important;
    }

    [role="cell"],
    [role="columnheader"] { border-color: ${t.border} !important; }

    /* ── Scrollbar ───────────────────────────────────────────────── */
    ::-webkit-scrollbar-track { background-color: ${t.background} !important; }
    ::-webkit-scrollbar-thumb { background-color: ${t.border} !important; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background-color: ${t.primary} !important; }

    /* ── Alert group collapse ────────────────────────────────────── */
    [data-testid="data-testid group-collapse-toggle"] {
      background-color: ${t.background} !important;
      border-color: ${t.background} !important;
    }

    /* ── Time Picker ─────────────────────────────────────────────── */
    section:has(#TimePickerContent),
    section:has(#TimePickerContent) section[role="dialog"] {
      background-color: ${t.background} !important;
    }

    .react-calendar {
      background-color: ${t.background} !important;
      border-color: ${t.border} !important;
    }

    .react-calendar__navigation__arrow {
      background-color: transparent !important;
      border-color: transparent !important;
      color: ${t.text} !important;
    }

    .react-calendar__navigation__arrow:hover { background-color: ${t.surfaceHover} !important; }

    .react-calendar__tile--hasActive,
    .react-calendar__tile--active {
      background-color: ${t.primary} !important;
      color: #fff !important;
      border-radius: 2px;
    }

    .react-calendar__tile:hover { background-color: ${t.surfaceHover} !important; }

    .react-calendar__month-view__weekdays__weekday abbr {
      color: ${t.primary} !important;
      text-decoration: none !important;
    }

    /* ── Collapse outline button ─────────────────────────────────── */
    button[aria-label="Collapse outline"] {
      background-color: ${t.background} !important;
    }

  `;

  document.head.appendChild(style);
  keepStyleLast();
}

// ─── Logo injection ──────────────────────────────────────────────────────────

function tryInjectLogo(): void {
  const controls = document.querySelector('[data-testid="data-testid dashboard controls"]') as HTMLElement | null;
  if (!controls || document.getElementById('voltigo-logo')) { return; }

  const refreshBtn = controls.querySelector('[data-testid="data-testid RefreshPicker run button"]') as HTMLElement | null;
  if (!refreshBtn) { return; }

  controls.style.position = 'relative';

  const cRect = controls.getBoundingClientRect();
  const bRect = refreshBtn.getBoundingClientRect();
  const topCss = `${bRect.top + bRect.height / 2 - cRect.top}px`;

  const img = document.createElement('img');
  img.id = 'voltigo-logo';
  img.src = LOGO_BASE64;
  img.alt = 'Voltigo';
  img.style.cssText = `position: absolute; left: 8px; top: ${topCss}; transform: translateY(-50%); height: 24px; width: auto; opacity: 0.9; pointer-events: none; z-index: 1;`;

  controls.appendChild(img);
}

function watchForLogo(): void {
  new MutationObserver(() => {
    if (!document.getElementById('voltigo-logo')) {
      tryInjectLogo();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// ─── Boot (runs on every page due to preload: true) ──────────────────────────

injectTheme();
tryInjectLogo();
watchForLogo();

// ─── Plugin registration ──────────────────────────────────────────────────────

const LazyApp = lazy(() => import('./components/App/App'));

const App = (props: AppRootProps) => (
  <Suspense fallback={<LoadingPlaceholder text="" />}>
    <LazyApp {...props} />
  </Suspense>
);

export const plugin = new AppPlugin().setRootPage(App);
