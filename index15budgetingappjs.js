// BUILD MARKER: 2026-08-21 08:05 UTC (critical fix: emergencySaveOnExit could overwrite real cloud data with blank state during the loading window)
// 1. Initialize Supabase Client
const SUPABASE_URL = 'https://icjhcoxjxpwohbnuejnr.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_aXiCqpts_u0Apyf7hbyHEg_ZYcwmoiy';

// Guards the one line in this whole file that runs before ANY of the
// app's own error handling exists yet (bootAppWithSession's try/catch,
// the boot-error-banner, all of it - none of that code has even been
// reached at this point in the file). If the Supabase SDK script itself
// failed to load from the CDN (slow connection, blocked by a firewall/
// ad-blocker, briefly offline, etc.), `supabase` is undefined here and
// the very next line would throw immediately - which used to silently
// kill the entire rest of the script, including everything that hides
// the loading overlay, leaving the page stuck on "Loading your data..."
// forever with zero explanation. This is exactly what a slow/blocked
// CDN load looks like, and it's a real, ordinary thing that happens on
// real networks - not a code bug, but the app should still say so
// clearly instead of hanging silently.
if (typeof supabase === 'undefined') {
    const overlay = document.getElementById('initial-load-overlay');
    if (overlay) {
        overlay.innerHTML = `
            <div style="max-width:320px; text-align:center; padding:20px; color:#f87171;">
                ⚠️ A required script didn't load (usually a slow or blocked connection).
                <br><br>
                <button onclick="location.reload()" style="padding:8px 20px; cursor:pointer; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:600;">Refresh to try again</button>
            </div>`;
    }
    throw new Error('Supabase SDK failed to load from the CDN - required script missing.');
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- TRANSLATIONS (EN / ES) ---
// This is a first pass covering the app's main, highest-traffic
// surfaces: the header, both navs, every major section title, the
// unified Add Activity form (card + modal + Kanban's quick-add), the
// Chronometer, Backlog, Goals, Notes chrome, and the walkthrough tour.
// It intentionally does NOT yet cover every deeper modal (category
// manager, trash, session history, import/export details) - those
// still show English on this first pass. Adding a string anywhere else
// in the app is just adding one more key here, then either a
// data-i18n[-title/-placeholder] attribute in the HTML or a t('key')
// call in the JS wherever that text gets set.
const LANG_STRINGS = {
    en: {
        'header.home': 'Home',
        'header.save': 'Save',
        'header.saveTitle': 'Save now (Ctrl+S)',
        'header.account': 'Account',
        'header.theme': 'Theme',
        'header.themeTitle': 'Toggle theme',
        'header.help': 'Help',
        'header.helpTitle': 'Show me around',
        'nav.timer': 'Timer',
        'nav.plan': 'Plan',
        'nav.log': 'Log',
        'nav.stats': 'Stats',
        'nav.board': 'Kanban',
        'nav.notes': 'Notes',
        'section.chronometer': 'Chronometer',
        'section.today': 'Today',
        'section.planner': 'Visual Weekly Time-Block Planner',
        'section.backlog': 'Backlog',
        'section.filters': 'Filters & Categories',
        'section.dayActivities': 'Day Activities',
        'section.analytics': 'Category Analytics',
        'section.goals': 'Goal Tracking',
        'section.kanban': 'Kanban Board',
        'kanban.doing': 'Doing',
        'kanban.done': 'Done',
        'kanban.emptyTodo': 'Nothing here yet.',
        'kanban.emptyOther': 'Drag a card here.',
        'common.clickToExpand': 'Click to expand / collapse',
        'activity.planned': '🌫️ Planned',
        'activity.completed': '🎯 Completed',
        'activity.hoursMode': 'Hours',
        'activity.exactTimes': 'Exact Times',
        'activity.startTime': 'Start Time',
        'activity.hoursLabel': 'Hours',
        'activity.endTime': 'End Time',
        'activity.categoryPlaceholder': 'Category',
        'activity.notesPlaceholder': 'Notes / topic (optional)',
        'activity.categoryFullPlaceholder': 'Category (e.g. coding)',
        'activity.dateLabel': 'Date',
        'activity.dateHint': '(optional — leave blank to send to Backlog)',
        'activity.addTitle': 'Add Activity',
        'activity.editTitle': 'Edit Activity',
        'activity.editBacklogTitle': 'Edit Backlog Item',
        'activity.addTimeBlockTitle': 'Add Activity - {date}',
        'timer.descPlaceholder': 'Description (optional)',
        'timer.start': '▶ Start',
        'timer.independent': 'Independent',
        'timer.linked': 'Linked',
        'timer.startBtn': 'Start',
        'timer.splitBtn': 'Split',
        'timer.stopBtn': 'Stop',
        'timer.resetBtn': 'Reset',
        'timer.splitNum': 'Split #',
        'timer.splitTime': 'Split Time',
        'timer.totalTime': 'Total Time',
        'backlog.add': '+ Add to Backlog',
        'goals.weeklyPlaceholder': 'Weekly target (hrs)',
        'goals.monthlyPlaceholder': 'Monthly target (hrs)',
        'goals.setGoal': 'Set Goal',
        'notes.newTitle': 'New note',
        'notes.new': '+ New',
        'notes.searchPlaceholder': '🔎 Search notes...',
        'notes.sortCustom': 'My order (drag to reorder)',
        'notes.sortAlpha': 'Alphabetical (A–Z)',
        'notes.untitled': 'Untitled note',
        'notes.notebookPlaceholder': 'Notebook',
        'notes.writeHere': 'Write here...',
        'notes.emptyNoNotes': 'No notes yet. Click "+ New" to start writing.',
        'notes.emptySearch': 'No notes match your search.',
        'notes.emptyNotebook': 'No notes in this notebook yet.',
        'log.filterPlaceholder': 'Filter by category...',
        'log.loggedToday': 'Logged Today: {hours} hrs',
        'stats.day': 'Day',
        'stats.week': 'Week',
        'stats.month': 'Month',
        'stats.allTime': 'All Time',
        'stats.logged': 'logged',
        'stats.total': 'total',
        'stats.nothingLogged': 'Nothing logged {period} yet.',
        'stats.periodToday': 'today',
        'stats.periodWeek': 'this week',
        'stats.periodMonth': 'this month',
        'section.export': 'All Sessions & Export',
        'export.everything': '💾 Export everything',
        'export.importBackup': '📂 Import backup',
        'export.downloadNotes': '📝 Download just notes',
        'export.linkDropbox': '📦 Link Dropbox for automatic backups',
        'export.filterPlaceholder': '🔍 Filter category (e.g. coding)',
        'export.clickRowHint': 'Click any row to edit or delete that entry.',
        'export.colDate': 'Date',
        'export.colCategory': 'Category',
        'export.colDescription': 'Description',
        'export.colPlane': 'Plane',
        'export.colHrs': 'Hrs',
        'export.totalHours': 'Total Hours:',
        'notes.sectionTitle': 'Notes',
        'notes.allNotesOption': 'All Notes',
        'plane.viewPlane': 'View Plane:',
        'plane.all': '🌐 All',
        'categories.manageTrigger': 'Categories',
        'categories.addPlaceholder': 'Add a category...',
        'header.dropboxTitle': 'Link Dropbox for automatic backups',
        'walkthrough.step1Title': 'Welcome to Nabu',
        'walkthrough.step1Text': "This is a quick tour of the main things you can do here. Skip it anytime - you can always come back to it from the Help button up top.",
        'walkthrough.step2Title': 'Start a timer',
        'walkthrough.step2Text': 'Working on something right now? Type what it is and hit Start. The time gets saved automatically while you work.',
        'walkthrough.step3Title': "Today's activities",
        'walkthrough.step3Text': "This is the strip for today's activities. For example, the activity you just started with the timer will show up here. From this summary you can see everything you've already done and what you have planned for today.",
        'walkthrough.step4Title': 'Your whole week',
        'walkthrough.step4Text': "Everything you log in Today also shows up here, across your whole week - so you can see what you've been doing, and also plan activities you haven't done yet. To add one, double-click anywhere on the calendar and type the category and name of that activity. That category gets saved, so you won't have to type it again next time.",
        'walkthrough.step5Title': 'Another way to add an activity',
        'walkthrough.step5Text': "If you'd rather not do it directly on the calendar, you can use this form instead: type how many hours it took, or an exact start and end time, and mark it Planned or Completed.",
        'walkthrough.step6Title': 'Kanban: for organizing tasks',
        'walkthrough.step6Text': "Kanban is a method a lot of companies use to organize tasks. It's split into three columns: Backlog, for what you want to do; Doing, for what you're working on right now; and Done, for what you've finished. Unlike calendar activities, tasks here don't have a fixed time - you move them from column to column as you go. One tip: keep no more than three tasks in Doing at a time, so you stay focused and actually finish things instead of piling up a bunch of unfinished tasks.",
        'walkthrough.step7Title': 'Notes',
        'walkthrough.step7Text': 'Write notes, attach photos or voice memos, and organize them into notebooks.',
        'walkthrough.step8Title': 'Goals & stats',
        'walkthrough.step8Text': 'Set a weekly goal per category and track your progress here, plus a breakdown of where your time actually goes.',
        'walkthrough.step9Title': "That's it",
        'walkthrough.step9Text': 'You can watch this tour again anytime from the Help button up top.',
        'walkthrough.skip': 'Skip',
        'walkthrough.back': 'Back',
        'walkthrough.next': 'Next',
        'walkthrough.done': 'Done',
        'walkthrough.stepOf': 'Step {current} of {total}',
        'months.0': 'January', 'months.1': 'February', 'months.2': 'March', 'months.3': 'April',
        'months.4': 'May', 'months.5': 'June', 'months.6': 'July', 'months.7': 'August',
        'months.8': 'September', 'months.9': 'October', 'months.10': 'November', 'months.11': 'December',
        'weekdays.0': 'Sun', 'weekdays.1': 'Mon', 'weekdays.2': 'Tue', 'weekdays.3': 'Wed',
        'weekdays.4': 'Thu', 'weekdays.5': 'Fri', 'weekdays.6': 'Sat'
    },
    es: {
        'header.home': 'Inicio',
        'header.save': 'Guardar',
        'header.saveTitle': 'Guardar ahora (Ctrl+S)',
        'header.account': 'Cuenta',
        'header.theme': 'Tema',
        'header.themeTitle': 'Cambiar tema',
        'header.help': 'Ayuda',
        'header.helpTitle': 'Mostrarme cómo funciona',
        'nav.timer': 'Cronómetro',
        'nav.plan': 'Plan',
        'nav.log': 'Registro',
        'nav.stats': 'Estadísticas',
        'nav.board': 'Kanban',
        'nav.notes': 'Notas',
        'section.chronometer': 'Cronómetro',
        'section.today': 'Hoy',
        'section.planner': 'Planificador Visual Semanal',
        'section.backlog': 'Pendientes',
        'section.filters': 'Filtros y categorías',
        'section.dayActivities': 'Actividades del día',
        'section.analytics': 'Análisis por categoría',
        'section.goals': 'Seguimiento de metas',
        'section.kanban': 'Tablero Kanban',
        'kanban.doing': 'En curso',
        'kanban.done': 'Hecho',
        'kanban.emptyTodo': 'Nada por aquí todavía.',
        'kanban.emptyOther': 'Arrastra una tarjeta aquí.',
        'common.clickToExpand': 'Toca para expandir / colapsar',
        'activity.planned': '🌫️ Planeado',
        'activity.completed': '🎯 Completado',
        'activity.hoursMode': 'Horas',
        'activity.exactTimes': 'Horas exactas',
        'activity.startTime': 'Hora de inicio',
        'activity.hoursLabel': 'Horas',
        'activity.endTime': 'Hora de fin',
        'activity.categoryPlaceholder': 'Categoría',
        'activity.notesPlaceholder': 'Notas / tema (opcional)',
        'activity.categoryFullPlaceholder': 'Categoría (ej. programación)',
        'activity.dateLabel': 'Fecha',
        'activity.dateHint': '(opcional — déjalo en blanco para enviarlo a Pendientes)',
        'activity.addTitle': 'Agregar actividad',
        'activity.editTitle': 'Editar actividad',
        'activity.editBacklogTitle': 'Editar pendiente',
        'activity.addTimeBlockTitle': 'Agregar actividad - {date}',
        'timer.descPlaceholder': 'Descripción (opcional)',
        'timer.start': '▶ Iniciar',
        'timer.independent': 'Independiente',
        'timer.linked': 'Vinculado',
        'timer.startBtn': 'Iniciar',
        'timer.splitBtn': 'Vuelta',
        'timer.stopBtn': 'Detener',
        'timer.resetBtn': 'Reiniciar',
        'timer.splitNum': 'Vuelta #',
        'timer.splitTime': 'Tiempo de vuelta',
        'timer.totalTime': 'Tiempo total',
        'backlog.add': '+ Agregar a Pendientes',
        'goals.weeklyPlaceholder': 'Meta semanal (hrs)',
        'goals.monthlyPlaceholder': 'Meta mensual (hrs)',
        'goals.setGoal': 'Establecer meta',
        'notes.newTitle': 'Nota nueva',
        'notes.new': '+ Nueva',
        'notes.searchPlaceholder': '🔎 Buscar notas...',
        'notes.sortCustom': 'Mi orden (arrastra para reordenar)',
        'notes.sortAlpha': 'Alfabético (A–Z)',
        'notes.untitled': 'Nota sin título',
        'notes.notebookPlaceholder': 'Cuaderno',
        'notes.writeHere': 'Escribe aquí...',
        'notes.emptyNoNotes': 'Aún no hay notas. Toca "+ Nueva" para empezar a escribir.',
        'notes.emptySearch': 'Ninguna nota coincide con tu búsqueda.',
        'notes.emptyNotebook': 'Aún no hay notas en este cuaderno.',
        'log.filterPlaceholder': 'Filtrar por categoría...',
        'log.loggedToday': 'Registrado hoy: {hours} hrs',
        'stats.day': 'Día',
        'stats.week': 'Semana',
        'stats.month': 'Mes',
        'stats.allTime': 'Todo',
        'stats.logged': 'registrado',
        'stats.total': 'total',
        'stats.nothingLogged': 'Nada registrado {period} todavía.',
        'stats.periodToday': 'hoy',
        'stats.periodWeek': 'esta semana',
        'stats.periodMonth': 'este mes',
        'section.export': 'Sesiones y exportación',
        'export.everything': '💾 Exportar todo',
        'export.importBackup': '📂 Importar respaldo',
        'export.downloadNotes': '📝 Descargar solo las notas',
        'export.linkDropbox': '📦 Vincular Dropbox para respaldo automático',
        'export.filterPlaceholder': '🔍 Filtrar por categoría (ej. programación)',
        'export.clickRowHint': 'Toca cualquier fila para editar o eliminar esa entrada.',
        'export.colDate': 'Fecha',
        'export.colCategory': 'Categoría',
        'export.colDescription': 'Descripción',
        'export.colPlane': 'Tipo',
        'export.colHrs': 'Hrs',
        'export.totalHours': 'Total de horas:',
        'notes.sectionTitle': 'Notas',
        'notes.allNotesOption': 'Todas las notas',
        'plane.viewPlane': 'Ver:',
        'plane.all': '🌐 Todo',
        'categories.manageTrigger': 'Categorías',
        'categories.addPlaceholder': 'Agregar una categoría...',
        'header.dropboxTitle': 'Vincular Dropbox para respaldo automático',
        'walkthrough.step1Title': 'Bienvenido a Nabu',
        'walkthrough.step1Text': 'Este es un recorrido rápido por lo principal que puedes hacer aquí. Puedes saltarlo en cualquier momento - siempre puedes volver a verlo desde el botón Ayuda, arriba.',
        'walkthrough.step2Title': 'Inicia un cronómetro',
        'walkthrough.step2Text': '¿Estás haciendo algo ahora mismo? Escribe qué es y presiona Iniciar. El tiempo se va guardando solo, mientras trabajas.',
        'walkthrough.step3Title': 'Las actividades de hoy',
        'walkthrough.step3Text': 'Esta es la franja de actividades de hoy. Por ejemplo, la actividad que acabas de iniciar con el cronómetro va a aparecer aquí. Desde este resumen ves todo lo que ya hiciste y lo que tienes planeado para hoy.',
        'walkthrough.step4Title': 'Tu semana completa',
        'walkthrough.step4Text': 'Todo lo que registras en Hoy también aparece aquí, en tu semana completa - así puedes ver qué has estado haciendo, y también planificar actividades que todavía no has hecho. Para agregar una, haz doble clic en cualquier parte del calendario y escribe la categoría y el nombre de esa actividad. Esa categoría queda guardada, así no tienes que volver a escribirla la próxima vez.',
        'walkthrough.step5Title': 'Otra forma de agregar una actividad',
        'walkthrough.step5Text': 'Si prefieres no hacerlo directamente sobre el calendario, puedes usar este formulario: escribe cuántas horas tomó, o una hora exacta de inicio y fin, y márcala como Planeada o Completada.',
        'walkthrough.step6Title': 'Kanban: para organizar tareas',
        'walkthrough.step6Text': 'Kanban es un método que usan muchas empresas para organizar tareas. Se divide en tres columnas: Pendientes, con lo que quieres hacer; En curso, con lo que estás haciendo ahora; y Hecho, con lo que ya terminaste. A diferencia de las actividades del calendario, las tareas de aquí no tienen una hora fija - las vas moviendo de una columna a otra a medida que avanzas. Un consejo: mantén como máximo tres tareas en En curso a la vez, así te mantienes enfocado y terminas lo que empiezas, en lugar de acumular tareas sin terminar.',
        'walkthrough.step7Title': 'Notas',
        'walkthrough.step7Text': 'Escribe notas, adjunta fotos o notas de voz, y organízalas en cuadernos.',
        'walkthrough.step8Title': 'Metas y estadísticas',
        'walkthrough.step8Text': 'Establece una meta semanal por categoría y sigue tu progreso aquí, además de un desglose de en qué se te va el tiempo.',
        'walkthrough.step9Title': 'Eso es todo',
        'walkthrough.step9Text': 'Puedes volver a ver este recorrido cuando quieras desde el botón Ayuda, arriba.',
        'walkthrough.skip': 'Saltar',
        'walkthrough.back': 'Atrás',
        'walkthrough.next': 'Siguiente',
        'walkthrough.done': 'Listo',
        'walkthrough.stepOf': 'Paso {current} de {total}',
        'months.0': 'enero', 'months.1': 'febrero', 'months.2': 'marzo', 'months.3': 'abril',
        'months.4': 'mayo', 'months.5': 'junio', 'months.6': 'julio', 'months.7': 'agosto',
        'months.8': 'septiembre', 'months.9': 'octubre', 'months.10': 'noviembre', 'months.11': 'diciembre',
        'weekdays.0': 'dom', 'weekdays.1': 'lun', 'weekdays.2': 'mar', 'weekdays.3': 'mié',
        'weekdays.4': 'jue', 'weekdays.5': 'vie', 'weekdays.6': 'sáb'
    }
};

// Defaults to Spanish if the browser itself is set to Spanish and
// nothing's been chosen yet - just a starting guess, and only on a
// person's very first visit; their own choice (once made) always wins
// from then on via localStorage.
let currentLang = localStorage.getItem('appLang')
    || (navigator.language && navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en');

// Looks up `key` in the current language, falling back to English if
// it's missing there (covers the first-pass gap honestly instead of
// showing a blank string), and finally to the key itself as a last
// resort so a typo'd key is at least visible/debuggable rather than
// silently empty. `vars` fills in {placeholders} like {date} or {hours}.
function t(key, vars) {
    let str = (LANG_STRINGS[currentLang] && LANG_STRINGS[currentLang][key])
        || LANG_STRINGS.en[key]
        || key;
    if (vars) {
        Object.keys(vars).forEach(k => {
            str = str.replace(`{${k}}`, vars[k]);
        });
    }
    return str;
}

// Walks every element carrying a data-i18n[-title/-placeholder]
// attribute and fills it in from the current language - this is what
// actually re-paints the static parts of the page instantly when the
// language is switched, with no reload. Called once on boot and again
// every time toggleLanguage() runs.
function applyTranslations() {
    // Re-render dynamic content FIRST - several things (the calendar
    // grid, Today strip, Notes list, Kanban) are rebuilt from scratch
    // with English text baked in at creation time, including this
    // button's title attribute. Doing this before the data-i18n-title
    // pass below means freshly-created elements get corrected in the
    // same pass instead of showing English until the next toggle.
    if (typeof renderCalendar === 'function') renderCalendar();
    if (typeof renderVisualMatrix === 'function') renderVisualMatrix();
    if (typeof renderTodayStrip === 'function') renderTodayStrip();
    if (typeof renderDayScheduleStack === 'function') renderDayScheduleStack();
    if (typeof renderBoardSection === 'function') renderBoardSection();
    if (typeof renderCategoryStats === 'function') renderCategoryStats();
    if (typeof renderNotebookSelector === 'function') renderNotebookSelector();
    if (typeof renderNotesList === 'function') renderNotesList();
    if (typeof renderNoteBlocks === 'function') {
        const openNote = (typeof notesData !== 'undefined') ? notesData.find(n => n.id === currentNoteId) : null;
        if (openNote) renderNoteBlocks(openNote);
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });

    const langLabel = document.getElementById('lang-toggle-label');
    if (langLabel) langLabel.innerText = currentLang === 'es' ? 'EN' : 'ES';
    document.documentElement.lang = currentLang;

    // If the walkthrough is open when the language changes, re-run its
    // own render too - otherwise the data-i18n pass above would reset
    // its Next/Done button back to the generic label even on the last
    // step, where it should say "Done" instead.
    const walkthroughPop = document.getElementById('walkthrough-popover');
    if (walkthroughPop && walkthroughPop.style.display !== 'none' && typeof showWalkthroughStep === 'function') {
        showWalkthroughStep(walkthroughIndex);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('appLang', currentLang);
    applyTranslations();
}

// --- ALWAYS START BLANK ---
// The app used to hydrate itself from whatever was left in localStorage
// from a previous visit, so a guest device kept showing old time blocks,
// backlog items and notes forever. Now every fresh load/reload starts
// completely empty - no time blocks, no backlog, no notes - regardless of
// what was here before. The ONLY way old data comes back is by logging
// into an account that has it in the cloud: supabaseClient.auth.onAuthStateChange
// below fires with the restored session, handleAuthSession() loads the
// cloud copy, and applyCloudSnapshot() populates the (currently empty)
// state from that. Clearing these specific keys also keeps a first-time
// "upload this device's data?" prompt (see handleAuthSession) from ever
// firing off of leftover data that was never actually shown to the user.
['flexibleTimeData', 'backlogItems', 'categoryGoals', 'customCategoryColors',
 'manualCategories', 'notesData', 'notesNotebooks', 'activeNotebookFilter']
    .forEach(key => localStorage.removeItem(key));

// --- DATA STATE & INITIALIZATION ---
let timeData = {};

let currentDate = new Date();
let selectedDateStr = formatDateKey(new Date());
let inputMode = 'simple';
let defaultEntryType = 'actual'; // Default to Actual when adding block
let modalEntryType = 'actual';
let currentRangeFilter = 'day';
let activeCategoryFilter = '';
// Set when a goal history bar is clicked: { start: Date, end: Date }. Lets
// isDateInRange() filter the sessions table to that exact period instead of
// only the fixed Day/Week/Month/All Time options.
let customRangeFilter = null;
let activePlaneFilter = 'all'; // 'all', 'projected', or 'actual'
let quickAddSlotInfo = null;

// Track active selected time block for single click / Supr key deletion
let selectedBlockReference = null; // { dateKey: 'YYYY-MM-DD', index: 0 }

// --- TOUCH: two-tap move (double-tap to arm, tap a destination to move) ---
// A continuous press-and-drag gesture is genuinely hard to execute
// reliably with one finger on a phone - easy to trigger a scroll by
// accident, or lose the block mid-drag. This replaces that, for touch
// specifically, with a more forgiving two-step version: double-tap a
// block to arm it (see the pulse this adds via .move-armed), then tap
// anywhere in a day's column to move it there - no continuous drag
// required. Double-tapping the SAME armed block again cancels the move
// without picking a destination. Long-press still opens the existing
// context menu (color/delete/edit) exactly as before - only the
// double-tap and move mechanics changed.
let armedMoveBlockRef = null; // { dateKey, index } - which block (if any) is currently armed to move

function toggleArmedMoveBlock(dateKey, index) {
    if (armedMoveBlockRef && armedMoveBlockRef.dateKey === dateKey && armedMoveBlockRef.index === index) {
        armedMoveBlockRef = null; // tapped the same armed block again - cancel
        hideDragGhost();
    } else {
        armedMoveBlockRef = { dateKey, index };
        if (navigator.vibrate) navigator.vibrate(30);
    }
    renderVisualMatrix();
}

// --- LIVE DRAG GHOST (touch) ---
// Once a block is armed (see toggleArmedMoveBlock), dragging a finger
// anywhere over the calendar shows a live preview of exactly where it
// would land if released right now - snapped to the same 15-minute
// grid the drop itself uses. This replaced an earlier version where
// you had to arm, then make a completely separate blind tap elsewhere
// with no visual feedback about where you were about to drop it.
let dragGhostEl = null;
let dragGhostTarget = null; // { dateKey, hour, mins } - wherever the ghost currently sits

function ensureDragGhost() {
    if (dragGhostEl) return dragGhostEl;
    dragGhostEl = document.createElement('div');
    dragGhostEl.className = 'touch-drag-ghost';
    document.body.appendChild(dragGhostEl);
    return dragGhostEl;
}

function hideDragGhost() {
    dragGhostTarget = null;
    if (dragGhostEl) dragGhostEl.style.display = 'none';
}

function updateDragGhost(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    const dayCol = el ? el.closest('.matrix-day-col') : null;
    if (!dayCol) { hideDragGhost(); return false; }

    const rect = dayCol.getBoundingClientRect();
    const relY = clientY - rect.top;
    const rawMinutes = (relY / 40) * 60;
    const snappedMinutes = Math.max(0, Math.min(23 * 60 + 45, Math.round(rawMinutes / 15) * 15));
    const hour = Math.floor(snappedMinutes / 60);
    const mins = snappedMinutes % 60;
    dragGhostTarget = { dateKey: dayCol.dataset.date, hour, mins };

    const block = armedMoveBlockRef && timeData[armedMoveBlockRef.dateKey] && timeData[armedMoveBlockRef.dateKey][armedMoveBlockRef.index];
    const durationHrs = block ? (block.hours || 1) : 1;

    const ghost = ensureDragGhost();
    ghost.style.display = 'flex';
    ghost.style.left = `${rect.left}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.top = `${rect.top + (snappedMinutes / 60) * 40}px`;
    ghost.style.height = `${Math.max(durationHrs * 40, 18)}px`;
    ghost.textContent = `${String(hour).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    return true;
}

let dragStartPoint = null; // { x, y } - where the touch was when the block was armed, used to detect a genuine drag vs a stray tap
let hasDraggedPastThreshold = false;

document.addEventListener('touchstart', (e) => {
    if (!armedMoveBlockRef) return;
    const touch = e.touches[0];
    if (touch) dragStartPoint = { x: touch.clientX, y: touch.clientY };
    hasDraggedPastThreshold = false;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!armedMoveBlockRef) return;
    const touch = e.touches[0];
    if (!touch) return;

    // Claim this gesture immediately, from the very first touchmove -
    // mobile browsers generally decide whether a touch sequence will be
    // handled as native scroll or as a custom gesture based on whether
    // preventDefault() was called on that first event. Only calling it
    // later (once a drag was confirmed past the threshold, or only when
    // directly over a valid drop target) let the browser already commit
    // to scrolling during the first few pixels of movement, which is
    // exactly what was making the background calendar move along with
    // the finger instead of staying still.
    e.preventDefault();

    if (dragStartPoint) {
        const dx = touch.clientX - dragStartPoint.x, dy = touch.clientY - dragStartPoint.y;
        if (Math.sqrt(dx * dx + dy * dy) > 12) hasDraggedPastThreshold = true; // ~12px of real movement before this counts as a drag, not just finger tremor on a tap
    }
    if (!hasDraggedPastThreshold) return; // not a real drag yet - don't show the ghost for what might just be a tap, but scroll is already suppressed above

    updateDragGhost(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (!armedMoveBlockRef) return;
    // No genuine drag happened - this touchend is just a tap (possibly
    // the first half of double-tapping the same armed block again to
    // cancel it). Completing a move here would be exactly the bug this
    // replaced: a tap with no visible feedback silently moving the
    // block to wherever it happened to land. Leave the block armed and
    // let the block's own double-tap handler decide what a second tap
    // on it means instead.
    if (!hasDraggedPastThreshold) { hideDragGhost(); return; }

    const touch = e.changedTouches[0];
    if (touch) updateDragGhost(touch.clientX, touch.clientY);

    if (!dragGhostTarget) { armedMoveBlockRef = null; hideDragGhost(); return; } // dragged off to somewhere invalid and released - cancels rather than guessing
    const { dateKey: fromDate, index: fromIndex } = armedMoveBlockRef;
    const { dateKey: toDate, hour, mins } = dragGhostTarget;
    armedMoveBlockRef = null;
    hideDragGhost();
    if (navigator.vibrate) navigator.vibrate(30);
    moveTimeBlockAbsolute(fromDate, fromIndex, toDate, hour, mins);
});

// Same "double-tap to arm, tap a destination to complete" pattern as
// the calendar's touch-move (see toggleArmedMoveBlock above) - reused
// here for Kanban cards, since native HTML5 drag-and-drop (what the
// mouse path uses) doesn't fire on touch at all, and this keeps the
// touch interaction language consistent with how moving already works
// everywhere else in the app rather than inventing a different gesture.
let armedMoveBoardCardId = null;

function toggleArmedMoveBoardCard(itemId) {
    armedMoveBoardCardId = (armedMoveBoardCardId === itemId) ? null : itemId;
    if (armedMoveBoardCardId && navigator.vibrate) navigator.vibrate(30);
    renderBoardSection();
}

// Track active selected backlog item (same idea, for the backlog strip)
let selectedBacklogId = null;

// Clipboard for Ctrl+C / Ctrl+V copy-paste of activities (calendar <-> backlog)
let clipboardBlockData = null; // { category, name, hours, type }

// Track the mouse position at all times so Ctrl+V can figure out where to paste
let lastMouseX = 0;
let lastMouseY = 0;
document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

// --- GOAL TRACKING STATE ---
// Per-category weekly/monthly target hours: { [categoryLower]: { weekly: number|null, monthly: number|null } }
let categoryGoals = {};

// --- CATEGORY PALETTE & CUSTOM COLOR LOGIC ---
const colorPalette = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
const categoryColorMap = {};
let customCategoryColors = {};

// Categories currently hidden from the big calendar (see
// buildDayColumnEl) - a view-only filter, never touches the
// underlying block data, so hiding is always safely reversible. This
// is genuinely new (no pre-existing equivalent) - unlike the "add a
// category" side of things below, which turned out to already exist.
let hiddenCategories = [];

// Escapes user-typed text (category names, notes) before it's dropped into
// innerHTML, so someone typing something like "<img src=x onerror=...>" as
// a category name can't inject a script tag into the page. Cheap to add now
// while the only strings involved are your own category/note fields; gets
// more important the moment real users' data is involved.
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- CUSTOM CONFIRM DIALOG ---
// Replaces native browser confirm() popups, which look and feel jarringly
// out of place next to the rest of the app's own styling (different font,
// different colors, a browser-chrome-styled OK/Cancel that can't be
// restyled at all). This renders the app's own modal instead and
// resolves a Promise<boolean> the same way confirm() would return
// true/false, so call sites just change `if (!confirm(x))` to
// `if (!(await showConfirmDialog(x)))` (and the enclosing function needs
// to be async, since a custom modal can't block synchronously the way
// the native dialog did).
let confirmDialogResolver = null;
function showConfirmDialog(message, options) {
    options = options || {};
    const overlay = document.getElementById('confirm-dialog-overlay');
    const messageEl = document.getElementById('confirm-dialog-message');
    const confirmBtn = document.getElementById('confirm-dialog-confirm-btn');
    const cancelBtn = document.getElementById('confirm-dialog-cancel-btn');
    if (!overlay || !messageEl || !confirmBtn || !cancelBtn) {
        // Markup missing for some reason - fail safe to native confirm
        // rather than silently always returning true/false.
        return Promise.resolve(confirm(message));
    }

    messageEl.textContent = message;
    confirmBtn.textContent = options.confirmLabel || 'Delete';
    cancelBtn.textContent = options.cancelLabel || 'Cancel';
    confirmBtn.classList.toggle('danger', options.danger !== false);

    overlay.classList.add('visible');

    return new Promise((resolve) => {
        confirmDialogResolver = resolve;
    });
}

function resolveConfirmDialog(result) {
    const overlay = document.getElementById('confirm-dialog-overlay');
    if (overlay) overlay.classList.remove('visible');
    if (confirmDialogResolver) {
        confirmDialogResolver(result);
        confirmDialogResolver = null;
    }
}

function getCategoryColor(cat) {
    const key = (cat || 'general').toLowerCase();
    if (customCategoryColors[key]) return customCategoryColors[key];
    if (!categoryColorMap[key]) {
        const index = Object.keys(categoryColorMap).length % colorPalette.length;
        categoryColorMap[key] = colorPalette[index];
    }
    return categoryColorMap[key];
}

// --- CATEGORY MANAGER (dropdown replacing the old always-on legend row) ---
// This shares the exact same underlying category list
// (manualCategories/getAllKnownCategories, defined further down) that
// the Add Activity modal's autocomplete already reads from - so a
// category added here shows up there immediately, and vice versa.
function getAllManagedCategories() {
    return getAllKnownCategories();
}

function addKnownCategory(name) {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const key = trimmed.toLowerCase();
    if (getAllKnownCategories().includes(key)) return false; // already exists, nothing to add
    manualCategories.push(key);
    saveManualCategories();
    refreshAllCategoryDropdowns();
    return true;
}

// Renames a category everywhere it's actually used - every block
// across every date, plus its custom color and goal entries - so the
// calendar, analytics, and everything else stay consistent under the
// new name rather than splitting into two separate categories.
function renameCategoryEverywhere(oldName, newName) {
    const oldKey = oldName.trim().toLowerCase();
    const newTrimmed = newName.trim();
    const newKey = newTrimmed.toLowerCase();
    if (!newTrimmed || oldKey === newKey) return false;

    Object.values(timeData).flat().forEach(b => {
        if (b.category && b.category.toLowerCase() === oldKey) b.category = newTrimmed;
    });
    backlogItems.forEach(item => {
        if (item.category && item.category.toLowerCase() === oldKey) item.category = newTrimmed;
    });
    if (customCategoryColors[oldKey]) {
        customCategoryColors[newKey] = customCategoryColors[oldKey];
        delete customCategoryColors[oldKey];
    }
    if (categoryGoals[oldKey]) {
        categoryGoals[newKey] = categoryGoals[oldKey];
        delete categoryGoals[oldKey];
    }
    manualCategories = manualCategories.filter(c => c !== oldKey);
    if (!getAllKnownCategories().includes(newKey)) manualCategories.push(newKey);
    hiddenCategories = hiddenCategories.map(c => c.toLowerCase() === oldKey ? newTrimmed : c);

    localStorage.setItem('customCategoryColors', JSON.stringify(customCategoryColors));
    localStorage.setItem('categoryGoals', JSON.stringify(categoryGoals));
    saveManualCategories();
    saveHiddenCategories();
    saveData();
    refreshAllCategoryDropdowns();
    refreshApp();
    return true;
}

// Follows the same safety rule as the existing category-manage modal:
// a category that's actually in use (a block, backlog item, or goal
// references it) can't be deleted outright, since that would silently
// orphan that data - only genuinely unused categories can be removed
// from the list. Hiding (see toggleCategoryVisibility) is the
// reversible alternative for a category that's in use but you don't
// want cluttering the calendar right now.
function deleteKnownCategory(name) {
    const key = name.trim().toLowerCase();
    if (isCategoryInUse(key)) return false;
    manualCategories = manualCategories.filter(c => c !== key);
    hiddenCategories = hiddenCategories.filter(c => c.toLowerCase() !== key);
    saveManualCategories();
    saveHiddenCategories();
    refreshAllCategoryDropdowns();
    renderCategoryManagerDropdown();
    return true;
}

function saveHiddenCategories() {
    localStorage.setItem('hiddenCategories', JSON.stringify(hiddenCategories));
    queueCloudSync();
}

function toggleCategoryVisibility(name) {
    const key = name.trim().toLowerCase();
    const idx = hiddenCategories.findIndex(c => c.toLowerCase() === key);
    if (idx === -1) hiddenCategories.push(name);
    else hiddenCategories.splice(idx, 1);
    saveHiddenCategories();
    renderVisualMatrix();
    renderTodayStrip();
}

function toggleCategoryManagerDropdown() {
    const panel = document.getElementById('category-manager-panel');
    const trigger = document.querySelector('.category-manager-trigger');
    if (!panel) return;
    const opening = !panel.classList.contains('open');
    panel.classList.toggle('open', opening);
    if (trigger) trigger.classList.toggle('open', opening);
    if (opening) renderCategoryManagerDropdown();
}
document.addEventListener('click', (e) => {
    const manager = document.getElementById('category-manager');
    const panel = document.getElementById('category-manager-panel');
    if (!manager || !panel || !panel.classList.contains('open')) return;
    if (!manager.contains(e.target)) {
        panel.classList.remove('open');
        document.querySelector('.category-manager-trigger')?.classList.remove('open');
    }
});

function submitAddKnownCategory() {
    const input = document.getElementById('category-manager-add-input');
    if (!input) return;
    if (addKnownCategory(input.value)) {
        input.value = '';
        renderCategoryManagerDropdown();
    } else {
        input.value = '';
        input.placeholder = 'Already exists or empty';
        setTimeout(() => { input.placeholder = 'Add a category...'; }, 1500);
    }
}

function startRenameCategoryInline(name, rowEl) {
    const nameEl = rowEl.querySelector('.category-manager-name');
    if (!nameEl) return;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'category-manager-rename-input';
    input.value = name;
    const commit = () => {
        const newName = input.value.trim();
        if (newName && newName.toLowerCase() !== name.toLowerCase()) {
            renameCategoryEverywhere(name, newName);
        }
        renderCategoryManagerDropdown();
    };
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') renderCategoryManagerDropdown();
    });
    input.addEventListener('blur', commit);
    nameEl.replaceWith(input);
    input.focus();
    input.select();
}

// Renders the full category list inside the dropdown panel - each row:
// a visibility checkbox (checked = shown on the big calendar), the
// color swatch, the name (click to rename inline), and a delete
// button. Rebuilt fresh each time the panel opens or the underlying
// category list changes.
function renderCategoryManagerDropdown() {
    const list = document.getElementById('category-manager-list');
    if (!list) return;
    const categories = getAllManagedCategories();

    if (categories.length === 0) {
        list.innerHTML = '<div class="category-manager-empty">No categories yet - add one above.</div>';
        return;
    }

    list.innerHTML = '';
    categories.forEach(cat => {
        const isHidden = hiddenCategories.some(c => c.toLowerCase() === cat);
        const color = getCategoryColor(cat);
        const row = document.createElement('div');
        row.className = 'category-manager-row';
        row.innerHTML = `
            <input type="checkbox" class="category-manager-visibility-cb" ${isHidden ? '' : 'checked'} title="Show on big calendar">
            <span class="category-manager-swatch" style="background:${color};"></span>
            <span class="category-manager-name">${escapeHtml(cat)}</span>
            <button type="button" class="category-manager-del-btn" title="Delete">🗑</button>
        `;
        row.querySelector('.category-manager-visibility-cb').addEventListener('change', () => toggleCategoryVisibility(cat));
        row.querySelector('.category-manager-name').addEventListener('click', () => startRenameCategoryInline(cat, row));
        row.querySelector('.category-manager-del-btn').addEventListener('click', () => deleteKnownCategory(cat));
        list.appendChild(row);
    });
}

function refreshApp() {
    renderCalendar();
    renderDayScheduleStack();
    renderAnalytics();
    renderVisualMatrix();
    renderTodayStrip();
    renderBacklogList();
    renderGoals();
    renderMobileCategoryOptions();
    renderCategoryStats();
    renderNotesList();
    refreshAllCategoryDropdowns();
    activeLiveTimerRef = findActiveLiveTimer();
    renderLiveTimerWidget();
    // Same rule as the modal's own chronometer button - hide it while a
    // timer's already running (only one can run at a time).
    const cardChronoBtn = document.getElementById('card-start-chronometer-btn');
    if (cardChronoBtn) cardChronoBtn.style.display = activeLiveTimerRef ? 'none' : 'flex';

    // If a session survived a page reload (e.g. the tab was refreshed
    // while it was running), re-flip the toggle too - otherwise the
    // underlying data would keep working correctly, but the visual
    // sync/connection to the original Start/Stop buttons would silently
    // be lost on every refresh.
    if (activeLiveTimerRef && !stopwatchLinkedToToday) {
        stopwatchLinkedToToday = true;
        const toggle = document.getElementById('stopwatch-link-toggle');
        if (toggle) toggle.checked = true;
    }
    if (typeof syncStopwatchWithLiveTimer === 'function') syncStopwatchWithLiveTimer();
}

// --- BIG CALENDAR WEEK/MONTH NAV BAR ---
// The big weekly planner's visible week is driven entirely by
// selectedDateStr (see renderVisualMatrix), so shifting it by 7 days moves
// the planner one week, and shifting the month moves it faster for long
// jumps. Keeps currentDate (the small calendar's month) in sync too, so
// both calendars always agree on where you're looking.
function shiftPlannerWeek(direction) {
    const parts = selectedDateStr.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + (direction * 7));
    selectedDateStr = formatDateKey(d);
    currentDate = new Date(d);
    refreshApp();
}

function shiftPlannerMonth(direction) {
    const parts = selectedDateStr.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setMonth(d.getMonth() + direction);
    selectedDateStr = formatDateKey(d);
    currentDate = new Date(d);
    refreshApp();
}

function jumpPlannerToToday() {
    const today = new Date();
    selectedDateStr = formatDateKey(today);
    currentDate = new Date(today);
    refreshApp();
}

// Collapsible filters + category legend block above the big calendar -
// closed by default so the planner doesn't feel crowded; remembered across
// visits via localStorage.
function togglePlannerHeader() {
    const panel = document.getElementById('planner-header-collapsible');
    const btn = document.getElementById('planner-header-toggle-btn');
    if (!panel) return;
    const isOpen = panel.classList.toggle('expanded');
    if (btn) btn.classList.toggle('open', isOpen);
    localStorage.setItem('plannerHeaderExpanded', isOpen ? '1' : '0');
}

// Sums logged "actual" hours per category within the current week/month —
// powers the Category Stats donut + legend.
function getCategoryTotalsForPeriod(rangeType) {
    let start, end;
    if (rangeType === 'day') {
        const today = new Date();
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    } else if (rangeType === 'month') {
        ({ start, end } = getMonthRangeOffset(0));
    } else {
        ({ start, end } = getWeekRangeOffset(0));
    }
    const totals = {};

    Object.keys(timeData).forEach(dateStr => {
        const parts = dateStr.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (d < start || d > end) return;

        (timeData[dateStr] || []).forEach(item => {
            const type = item.type || 'actual';
            if (type !== 'actual') return;
            const cat = (item.category || 'general').toLowerCase();
            totals[cat] = (totals[cat] || 0) + (parseFloat(item.hours) || 0);
        });
    });

    return Object.entries(totals)
        .map(([category, hours]) => ({ category, hours }))
        .sort((a, b) => b.hours - a.hours);
}

let statsPeriod = 'week';

function setStatsPeriod(period) {
    statsPeriod = period;
    document.getElementById('stats-period-day')?.classList.toggle('active', period === 'day');
    document.getElementById('stats-period-week')?.classList.toggle('active', period === 'week');
    document.getElementById('stats-period-month')?.classList.toggle('active', period === 'month');
    renderCategoryStats();
}

function renderCategoryStats() {
    const donut = document.getElementById('category-stats-donut');
    const legend = document.getElementById('category-stats-legend');
    if (!donut || !legend) return;

    const data = getCategoryTotalsForPeriod(statsPeriod);
    const totalHours = data.reduce((sum, d) => sum + d.hours, 0);
    const periodLabel = statsPeriod === 'day' ? t('stats.periodToday') : statsPeriod === 'week' ? t('stats.periodWeek') : t('stats.periodMonth');

    if (totalHours === 0) {
        donut.style.background = 'var(--input-bg)';
        donut.innerHTML = `<div class="category-stats-donut-center">0h<br><small>${t('stats.logged')}</small></div>`;
        legend.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; padding:8px 4px;">${t('stats.nothingLogged', { period: periodLabel })}</div>`;
        return;
    }

    let cumulativePct = 0;
    const gradientStops = data.map(d => {
        const pct = (d.hours / totalHours) * 100;
        const color = getCategoryColor(d.category);
        const stop = `${color} ${cumulativePct}% ${cumulativePct + pct}%`;
        cumulativePct += pct;
        return stop;
    });

    donut.style.background = `conic-gradient(${gradientStops.join(', ')})`;
    donut.innerHTML = `<div class="category-stats-donut-center">${totalHours.toFixed(1)}h<br><small>${t('stats.total')}</small></div>`;

    legend.innerHTML = data.map(d => {
        const pct = ((d.hours / totalHours) * 100).toFixed(1);
        const color = getCategoryColor(d.category);
        return `
            <div class="category-stats-row">
                <div class="category-stats-pct" style="background:${color};">${pct}%</div>
                <div class="category-stats-name">${d.category}</div>
                <div class="category-stats-hrs">${d.hours.toFixed(1)}h</div>
            </div>
        `;
    }).join('');
}

// Collects every category name that's ever been used anywhere in the app
// (logged activities, backlog, goals, custom colors) so the mobile
// quick-pick dropdown always has the full up-to-date list.
function getAllKnownCategories() {
    const cats = new Set();
    Object.values(timeData).flat().forEach(b => {
        if (b.category) cats.add(b.category.trim().toLowerCase());
    });
    (backlogItems || []).forEach(b => {
        if (b.category) cats.add(b.category.trim().toLowerCase());
    });
    Object.keys(categoryGoals).forEach(c => cats.add(c));
    Object.keys(customCategoryColors).forEach(c => cats.add(c));
    (manualCategories || []).forEach(c => cats.add(c));
    return Array.from(cats).filter(Boolean).sort();
}

// --- CATEGORY MANAGEMENT (add / delete unused categories) ---
// manualCategories are categories the user explicitly created via the
// "+ New category…" option or the Manage Categories modal. They show up in
// every category dropdown even before they've been used anywhere, and are
// the only categories that can be deleted (deleting a category that's
// actively used by a logged block, backlog item, or goal would silently
// orphan that data, so those stay list-only with delete disabled).
let manualCategories = [];

function saveManualCategories() {
    localStorage.setItem('manualCategories', JSON.stringify(manualCategories));
}

// True if a category is referenced anywhere outside manualCategories itself.
function isCategoryInUse(catLower) {
    if (Object.values(timeData).flat().some(b => (b.category || '').trim().toLowerCase() === catLower)) return true;
    if ((backlogItems || []).some(b => (b.category || '').trim().toLowerCase() === catLower)) return true;
    if (Object.prototype.hasOwnProperty.call(categoryGoals, catLower)) return true;
    return false;
}

// Re-syncs category-driven UI after categories change anywhere (added,
// deleted, or typed fresh into any combobox). The comboboxes themselves
// (category-name, backlog-category, modal-category-name) just read
// getAllKnownCategories() fresh every time they're opened, so there's
// nothing to pre-populate for them - this just keeps the shared <datalist>
// (used by the goal/notes category fields) and the mobile picker current.
function refreshAllCategoryDropdowns() {
    const datalist = document.getElementById('category-list');
    if (datalist) {
        datalist.innerHTML = getAllKnownCategories().map(c => `<option value="${escapeHtml(c)}"></option>`).join('');
    }
}

function openCategoryManageModal() {
    const modal = document.getElementById('category-manage-modal');
    const input = document.getElementById('new-category-input');
    if (input) input.value = '';
    renderCategoryManageList();
    if (modal) modal.style.display = 'block';
}

function closeCategoryManageModal() {
    const modal = document.getElementById('category-manage-modal');
    if (modal) modal.style.display = 'none';
}

function addNewCategoryFromManageModal() {
    const input = document.getElementById('new-category-input');
    const name = (input?.value || '').trim().toLowerCase();
    if (!name) return;
    if (!manualCategories.includes(name)) {
        manualCategories.push(name);
        saveManualCategories();
    }
    if (input) input.value = '';
    renderCategoryManageList();
    refreshAllCategoryDropdowns();
}

function deleteManualCategory(name) {
    const catLower = name.trim().toLowerCase();
    if (isCategoryInUse(catLower)) return; // safety net - UI already disables this
    manualCategories = manualCategories.filter(c => c !== catLower);
    saveManualCategories();
    renderCategoryManageList();
    refreshAllCategoryDropdowns();
}

function renderCategoryManageList() {
    const list = document.getElementById('category-manage-list');
    if (!list) return;
    const categories = getAllKnownCategories();

    if (categories.length === 0) {
        list.innerHTML = '<div class="category-manage-empty">No categories yet. Add one above.</div>';
        return;
    }

    list.innerHTML = categories.map(c => {
        const inUse = isCategoryInUse(c);
        const color = getCategoryColor(c);
        return `
            <div class="category-manage-row">
                <span class="category-manage-dot" style="background:${color};"></span>
                <span class="category-manage-name">${escapeHtml(c)}</span>
                ${inUse
                    ? '<span class="category-manage-inuse">In use</span>'
                    : `<button class="category-manage-del" onclick="deleteManualCategory('${c.replace(/'/g, "\\'")}')">Delete</button>`
                }
            </div>
        `;
    }).join('');
}

document.getElementById('category-manage-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'category-manage-modal') closeCategoryManageModal();
});

// Rebuilds the mobile "quick-pick category" dropdown so it's never stale.
function renderMobileCategoryOptions() {
    const select = document.getElementById('mobile-category-select');
    if (!select) return;

    const categories = getAllKnownCategories();
    const currentVal = select.value;

    select.innerHTML = '<option value="">Select category…</option>' +
        categories.map(c => `<option value="${c}">${c}</option>`).join('') +
        '<option value="__new__">+ New category…</option>';

    if (categories.includes(currentVal)) select.value = currentVal;
}

// Wires the mobile dropdown into the real category text input (the same
// one the desktop form uses) so picking from the list is the same as typing.
function handleMobileCategorySelect(value) {
    const catInput = document.getElementById('category-name');
    if (!catInput) return;

    if (value === '__new__') {
        catInput.value = '';
        catInput.focus();
    } else if (value) {
        catInput.value = value;
    }
}

// --- CATEGORY COMBOBOX (shared by every "Category" field) ---
// Type a letter and matching categories show up live; leaving it empty (or
// clicking the ▾ arrow) lists every known category so you never have to type
// at all. Works identically for the desktop log form (category-name), the
// Backlog add form (backlog-category), and the calendar quick-add/edit
// modal (modal-category-name) - each just needs a matching
// "<inputId>-combo-list" div next to it in the HTML.
function getCategoryComboEls(inputId) {
    return {
        input: document.getElementById(inputId),
        list: document.getElementById(inputId + '-combo-list')
    };
}

function showCategoryCombo(inputId, forceShowAll) {
    const { input, list } = getCategoryComboEls(inputId);
    if (!input || !list) return;

    const query = forceShowAll ? '' : input.value.trim().toLowerCase();
    const categories = getAllKnownCategories();
    const matches = query ? categories.filter(c => c.includes(query)) : categories;

    if (matches.length === 0) {
        list.innerHTML = query
            ? `<div class="category-combo-item category-combo-item-new" onmousedown="selectCategoryCombo('${inputId}', '${query.replace(/'/g, "\\'")}')">➕ Use "${escapeHtml(query)}"</div>`
            : `<div class="category-combo-empty">No categories yet - just type a name to create one.</div>`;
        list.classList.add('open');
        return;
    }

    list.innerHTML = matches.map(c =>
        `<div class="category-combo-item" onmousedown="selectCategoryCombo('${inputId}', '${c.replace(/'/g, "\\'")}')">${escapeHtml(c)}</div>`
    ).join('');
    list.classList.add('open');
}

function selectCategoryCombo(inputId, value) {
    const { input, list } = getCategoryComboEls(inputId);
    if (input) input.value = value;
    if (list) {
        list.classList.remove('open');
        list.innerHTML = '';
    }
    if (!manualCategories.includes(value) && !getAllKnownCategories().includes(value)) {
        manualCategories.push(value);
        saveManualCategories();
    }
}

// Arrow-button click: toggles the dropdown, always showing every category
// (ignoring whatever's currently typed) so clicking the arrow is a reliable
// "show me everything" action even if you'd typed a filter first.
function toggleCategoryCombo(inputId) {
    const { list } = getCategoryComboEls(inputId);
    if (!list) return;

    if (list.classList.contains('open')) {
        list.classList.remove('open');
        list.innerHTML = '';
    } else {
        showCategoryCombo(inputId, true);
    }
}

document.addEventListener('click', (e) => {
    document.querySelectorAll('.category-combo-list.open').forEach(list => {
        const wrap = list.closest('.category-combo-wrap');
        if (wrap && !wrap.contains(e.target)) {
            list.classList.remove('open');
            list.innerHTML = '';
        }
    });
});

// --- FORM MODES & PLANNED / ACTUAL TOGGLES ---
function setMode(mode) {
    inputMode = mode;
    document.getElementById('mode-simple')?.classList.toggle('active', mode === 'simple');
    document.getElementById('mode-exact')?.classList.toggle('active', mode === 'exact');
    document.getElementById('hours-field-group').style.display = mode === 'simple' ? 'flex' : 'none';
    document.getElementById('end-time-field-group').style.display = mode === 'exact' ? 'flex' : 'none';
    // Hours mode has no separate "which time slot" step - re-suggest the
    // next open slot as Start Time so it's ready to go, still editable
    // if that's not actually the one wanted.
    if (mode === 'simple') refreshCardStartTimeSuggestion();
}

// Suggests the next open slot today as a starting point for Start Time
// (Hours mode on the card) - called on load and whenever Hours mode is
// switched into, so the field is never stale, but never touched again
// after that so it doesn't fight with something already typed in.
function refreshCardStartTimeSuggestion() {
    const startInput = document.getElementById('start-time');
    if (!startInput) return;
    const h = getNextAvailableHour(selectedDateStr);
    startInput.value = `${String(h).padStart(2, '0')}:00`;
}

function setEntryType(type) {
    defaultEntryType = type;
    document.getElementById('type-projected')?.classList.toggle('active', type === 'projected');
    document.getElementById('type-actual')?.classList.toggle('active', type === 'actual');
}

function setModalType(type) {
    modalEntryType = type;
    document.getElementById('modal-type-projected')?.classList.toggle('active', type === 'projected');
    document.getElementById('modal-type-actual')?.classList.toggle('active', type === 'actual');
}

// Mirrors setMode() for the main Log Time card, but for the popup
// modal: Hours mode swaps the End Time field for a plain "how many
// hours" field (Start Time stays put as the anchor either way) so you
// can type "3" instead of picking an exact end clock time - see
// submitQuickAddModal() for where that gets turned back into an end
// time right before saving.
let modalTimeMode = 'exact';
function setModalTimeMode(mode) {
    modalTimeMode = mode;
    document.getElementById('modal-mode-hours')?.classList.toggle('active', mode === 'hours');
    document.getElementById('modal-mode-exact')?.classList.toggle('active', mode === 'exact');
    const endGroup = document.getElementById('modal-end-time-group');
    const hoursGroup = document.getElementById('modal-hours-group');
    if (endGroup) endGroup.style.display = mode === 'exact' ? 'flex' : 'none';
    if (hoursGroup) hoursGroup.style.display = mode === 'hours' ? 'flex' : 'none';
}

function addTimeBlock() {
    const catInput = document.getElementById('category-name');
    const actInput = document.getElementById('activity-name');
    const category = catInput.value.trim() || 'General';
    const name = actInput.value.trim();

    const startVal = document.getElementById('start-time').value || '09:00';
    let endVal;

    if (inputMode === 'simple') {
        const durHours = parseFloat(document.getElementById('duration-hours').value) || 1;
        const [sH, sM] = startVal.split(':').map(Number);
        const totalMins = Math.min(24 * 60 - 1, (sH * 60 + sM) + Math.round(durHours * 60));
        endVal = `${String(Math.floor(totalMins / 60)).padStart(2, '0')}:${String(totalMins % 60).padStart(2, '0')}`;
    } else {
        endVal = document.getElementById('end-time').value || '11:00';
    }

    const [sH, sM] = startVal.split(':').map(Number);
    const [eH, eM] = endVal.split(':').map(Number);
    const hours = Math.max(0.25, (eH + eM / 60) - (sH + sM / 60));
    const timeRange = `${startVal} to ${endVal}`;

    if (!timeData[selectedDateStr]) timeData[selectedDateStr] = [];
    timeData[selectedDateStr].push({
        category,
        name,
        hours,
        timeRange,
        type: defaultEntryType
    });

    saveData();
    catInput.value = '';
    actInput.value = '';
    const mobileSelect = document.getElementById('mobile-category-select');
    if (mobileSelect) mobileSelect.value = '';
    refreshApp();
    if (inputMode === 'simple') refreshCardStartTimeSuggestion();
}

// --- PLANE FILTER CONTROL ---
function setPlaneFilter(plane) {
    activePlaneFilter = plane;
    document.querySelectorAll('.plane-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`plane-${plane}`)?.classList.add('active');
    renderVisualMatrix();
}

// --- THEME SWITCHER LOGIC ---
const THEME_ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
const THEME_ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';

// --- HEADER HAMBURGER MENU (mobile) ---
// On phones, the row of action buttons (Home/Save/Account/Theme/
// Dropbox) collapses behind a single hamburger button instead of
// always taking up its own strip of vertical space - freeing that
// space up for the Chronometer and Today strip below it. Desktop is
// unaffected (the button itself is hidden there via CSS, and the row
// stays visible as it always has).
function toggleHeaderMenu() {
    const wrap = document.getElementById('header-actions-wrap');
    const backdrop = document.getElementById('header-menu-backdrop');
    const btn = document.getElementById('header-menu-btn');
    if (!wrap) return;
    const opening = !wrap.classList.contains('open');
    wrap.classList.toggle('open', opening);
    if (backdrop) backdrop.classList.toggle('visible', opening);
    if (btn) btn.classList.toggle('open', opening);
}

function closeHeaderMenu() {
    const wrap = document.getElementById('header-actions-wrap');
    const backdrop = document.getElementById('header-menu-backdrop');
    const btn = document.getElementById('header-menu-btn');
    if (wrap) wrap.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
    if (btn) btn.classList.remove('open');
}
(function setupHeaderMenuAutoClose() {
    const wrap = document.getElementById('header-actions-wrap');
    if (!wrap) return;
    wrap.addEventListener('click', (e) => {
        if (e.target.closest('.theme-toggle-btn')) {
            setTimeout(closeHeaderMenu, 150); // small delay so the actual click (e.g. theme swap) visibly registers first
        }
    });
})();

function toggleTheme() {
    document.documentElement.classList.toggle('light-theme');
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    // Inverted from what the class name suggests - see the CSS comment
    // on body.light-theme for why. isLight here actually means "the
    // dark view is showing", so the icon shown is what you'd get by
    // clicking again: sun (go light) while dark is showing, moon (go
    // dark) while light is showing.
    document.getElementById('theme-icon').innerHTML = isLight ? THEME_ICON_SUN : THEME_ICON_MOON;
    document.getElementById('theme-text').innerText = 'Theme';
    localStorage.setItem('themePreference', isLight ? 'light' : 'dark');
}

if (localStorage.getItem('themePreference') === 'light') {
    toggleTheme();
}

// --- STOPWATCH <-> LIVE TIMER SYNC ---
// The original Chronometer (Start/Split/Stop/Reset) used to be
// completely disconnected from the rest of the app - pressing Start
// counted time with nothing to show for it once you stopped. The
// toggle switch above it links it to the same real activity-logging
// system the Live Timer bars (see the two copies of .live-timer-bar -
// one here, one above the Today strip) already use. Every one of these
// three controls just reflects the one shared activeLiveTimerRef - not
// three independent counters that happen to look similar - so starting
// any of them starts all of them, pausing any pauses all of them.
let stopwatchLinkedToToday = false;

function setStopwatchLinkedToToday(isChecked) {
    stopwatchLinkedToToday = isChecked;
    renderLiveTimerWidget();
    if (typeof layoutTimerPageForMobile === 'function') layoutTimerPageForMobile();
}

// Called from beginLiveTimer()/pauseResumeLiveTimer()/finishLiveTimer()
// - this is what makes the sync bidirectional: regardless of whether a
// session was started/paused/finished via the original chronometer's
// own buttons or either Live Timer bar's own buttons, all three of
// those functions call this afterward, so the original chronometer's
// display and button states always end up matching reality.
function syncStopwatchWithLiveTimer() {
    if (!startBtn || !stopBtn || !splitBtn) return;

    if (!activeLiveTimerRef) {
        // No active session. If the toggle is on, reset back to a
        // clean idle state. If it's off, leave the display completely
        // alone - this function has no business touching a plain
        // stopwatch someone's using on its own with the toggle off.
        if (stopwatchLinkedToToday) {
            clearInterval(timerInterval);
            elapsedTime = 0;
            if (stopwatchDisplay) stopwatchDisplay.innerHTML = "00:00:00.00";
            startBtn.disabled = false; stopBtn.disabled = true; splitBtn.disabled = true;
        }
        return;
    }

    const block = timeData[activeLiveTimerRef.dateKey] && timeData[activeLiveTimerRef.dateKey][activeLiveTimerRef.index];
    if (!block || !block.liveTimer) return;

    const isRunning = !!block.liveTimer.runningSince;
    startBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;
    splitBtn.disabled = !isRunning;

    // Keep the numeric display exact - driven by the live timer's own
    // elapsed calculation every tick (see the shared setInterval below),
    // not the stopwatch's own independent counter, so the two can never
    // drift apart even by a fraction of a second.
    elapsedTime = block.liveTimer.accumulatedMs + (block.liveTimer.runningSince ? Date.now() - block.liveTimer.runningSince : 0);
    if (stopwatchDisplay) stopwatchDisplay.innerHTML = timeToString(elapsedTime);
}

// --- STOPWATCH LOGIC ---
let startTime = 0, elapsedTime = 0, timerInterval;
let lastSplitTime = 0, splitCount = 0;

const stopwatchDisplay = document.getElementById('stopwatch-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const splitBtn = document.getElementById('split-btn');
const splitContainer = document.getElementById('split-container');
const splitLog = document.getElementById('split-log');

function timeToString(time) {
    let hh = Math.floor(time / 3600000), mm = Math.floor((time % 3600000) / 60000), ss = Math.floor((time % 60000) / 1000), ms = Math.floor((time % 1000) / 10);
    return `${hh.toString().padStart(2,"0")}:${mm.toString().padStart(2,"0")}:${ss.toString().padStart(2,"0")}.${ms.toString().padStart(2,"0")}`;
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        // Toggle is on and nothing's already running - this press
        // creates a real logged activity, not just a plain count.
        // Category/notes come from whichever Live Timer bar has
        // something typed in it (there are two, one here and one above
        // the Today strip) - "General" if neither does, so this is
        // never blocked on filling in a field first. beginLiveTimer()
        // itself calls syncStopwatchWithLiveTimer() once the session
        // exists, which sets elapsedTime/display/button-state correctly
        // - no need to also start the plain internal interval below in
        // this path.
        if (stopwatchLinkedToToday && !activeLiveTimerRef) {
            const catInput = [...document.querySelectorAll('.live-timer-category-input-el')].find(el => el.value.trim());
            const notesInput = [...document.querySelectorAll('.live-timer-notes-input-el')].find(el => el.value.trim());
            const category = (catInput && catInput.value.trim()) || 'General';
            const name = (notesInput && notesInput.value.trim()) || '';
            const now = new Date();
            beginLiveTimer(formatDateKey(now), now.getHours(), now.getMinutes(), category, name);
            document.querySelectorAll('.live-timer-category-input-el, .live-timer-notes-input-el').forEach(el => el.value = '');
            return;
        }
        // Toggle is on and a session is already running (e.g. started
        // from one of the Live Timer bars) - resume it rather than
        // starting a second, competing count.
        if (stopwatchLinkedToToday && activeLiveTimerRef) {
            const block = timeData[activeLiveTimerRef.dateKey] && timeData[activeLiveTimerRef.dateKey][activeLiveTimerRef.index];
            if (block && block.liveTimer && !block.liveTimer.runningSince) pauseResumeLiveTimer();
            return;
        }

        // Toggle is off - behaves exactly like the original plain
        // stopwatch always did, no activity logging involved.
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => { 
            elapsedTime = Date.now() - startTime; 
            if (stopwatchDisplay) stopwatchDisplay.innerHTML = timeToString(elapsedTime); 
        }, 10);
        startBtn.disabled = true; stopBtn.disabled = false; splitBtn.disabled = false;
    });
}

if (stopBtn) {
    stopBtn.addEventListener('click', () => { 
        clearInterval(timerInterval); 
        startBtn.disabled = false; stopBtn.disabled = true; splitBtn.disabled = true;

        // Linked and a session is actively running - Stop pauses it
        // (not finishes it), same as the Live Timer bar's own Pause
        // button, so it can still be resumed later rather than closed
        // out for good.
        if (stopwatchLinkedToToday && activeLiveTimerRef) {
            const block = timeData[activeLiveTimerRef.dateKey] && timeData[activeLiveTimerRef.dateKey][activeLiveTimerRef.index];
            if (block && block.liveTimer && block.liveTimer.runningSince) pauseResumeLiveTimer();
        }
    });
}

if (splitBtn) {
    splitBtn.addEventListener('click', () => {
        splitCount++;
        if (splitContainer) splitContainer.style.display = 'block';
        let currentTotal = elapsedTime;
        let currentSplit = currentTotal - lastSplitTime;
        lastSplitTime = currentTotal;

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${splitCount}</td>
            <td style="color: var(--accent);">${timeToString(currentSplit)}</td>
            <td>${timeToString(currentTotal)}</td>
        `;
        if (splitLog) splitLog.insertBefore(tr, splitLog.firstChild); 
    });
}

const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => { 
        clearInterval(timerInterval); 
        if (stopwatchDisplay) stopwatchDisplay.innerHTML = "00:00:00.00"; 
        elapsedTime = 0; lastSplitTime = 0; splitCount = 0;
        if (splitLog) splitLog.innerHTML = '';
        if (splitContainer) splitContainer.style.display = 'none';
        startBtn.disabled = false; stopBtn.disabled = true; splitBtn.disabled = true;

        // Linked and there's an active session (running or paused) -
        // Reset means "I'm actually done", so this finalizes and logs
        // the activity for real, same as pressing Finish on the Live
        // Timer bar would.
        if (stopwatchLinkedToToday && activeLiveTimerRef) {
            finishLiveTimer();
        }
    });
}

// --- UTILITIES ---
function formatDateKey(date) { 
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; 
}

// --- UNDO / REDO (Ctrl+Z / Ctrl+Shift+Z) ---
// Snapshots the on-disk state of timeData + backlogItems right before it
// gets overwritten, so any add/delete/move/paste on the calendar can be
// undone. Captured inside saveData()/saveBacklogItems() themselves so every
// existing call site gets undo support automatically.
let undoStack = [];
let redoStack = [];
const MAX_UNDO_STEPS = 50;

function pushUndoSnapshot() {
    undoStack.push({
        timeData: localStorage.getItem('flexibleTimeData'),
        backlogItems: localStorage.getItem('backlogItems')
    });
    if (undoStack.length > MAX_UNDO_STEPS) undoStack.shift();
    redoStack = [];
    updateGlobalUndoBtn();
}

function applySnapshot(snapshot) {
    if (snapshot.timeData !== null) {
        timeData = JSON.parse(snapshot.timeData);
        localStorage.setItem('flexibleTimeData', snapshot.timeData);
    } else {
        timeData = {};
        localStorage.removeItem('flexibleTimeData');
    }

    if (snapshot.backlogItems !== null) {
        backlogItems = JSON.parse(snapshot.backlogItems);
        localStorage.setItem('backlogItems', snapshot.backlogItems);
    } else {
        backlogItems = [];
        localStorage.removeItem('backlogItems');
    }

    selectedBlockReference = null;
    selectedBacklogId = null;
    refreshApp();
}

function undoLastAction() {
    if (undoStack.length === 0) return;
    const prevSnapshot = undoStack.pop();
    redoStack.push({
        timeData: localStorage.getItem('flexibleTimeData'),
        backlogItems: localStorage.getItem('backlogItems')
    });
    applySnapshot(prevSnapshot);
    updateGlobalUndoBtn();
}

function redoLastAction() {
    if (redoStack.length === 0) return;
    const nextSnapshot = redoStack.pop();
    undoStack.push({
        timeData: localStorage.getItem('flexibleTimeData'),
        backlogItems: localStorage.getItem('backlogItems')
    });
    applySnapshot(nextSnapshot);
    updateGlobalUndoBtn();
}

// Mirrors updateNotesUndoBtn() below, but for the floating phone button
// (#mobile-global-undo) that stands in for Ctrl+Z/Ctrl+Shift+Z on
// calendar/backlog actions everywhere except the Notes tab, which
// already has its own undo/redo pair in its toolbar. Called after every
// snapshot push/undo/redo, and once on load/tab-switch from
// setMobileSection() so it's correct as soon as the page opens.
function updateGlobalUndoBtn() {
    const wrap = document.getElementById('mobile-global-undo');
    if (!wrap) return;
    wrap.classList.toggle('hidden-for-notes', currentMobileSection === 'notes');
    const undoBtn = document.getElementById('mobile-global-undo-btn');
    const redoBtn = document.getElementById('mobile-global-redo-btn');
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

function saveData() {
    pushUndoSnapshot();
    localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
    queueCloudSync();
}

function getNextAvailableHour(dateStr) {
    const existing = timeData[dateStr] || [];
    let maxHour = 9;

    existing.forEach(item => {
        if (item.timeRange) {
            const parts = item.timeRange.split(' to ');
            if (parts.length === 2) {
                const endH = parseInt(parts[1].split(':')[0], 10);
                if (endH > maxHour) maxHour = endH;
            }
        }
    });

    return Math.min(23, maxHour);
}

// --- MINI CALENDAR RENDER ---
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('month-year-title');
    if (!grid || !title) return;

    grid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = t(`months.${month}`);
    title.innerText = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`;

    for (let d = 0; d < 7; d++) {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'weekday';
        dayHeader.innerText = t(`weekdays.${d}`);
        grid.appendChild(dayHeader);
    }

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        grid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= totalDays; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEl = document.createElement('div');
        dayEl.className = 'day';

        const dayNumEl = document.createElement('div');
        dayNumEl.className = 'day-number';
        dayNumEl.innerText = day;
        dayEl.appendChild(dayNumEl);

        if (dateKey === selectedDateStr) dayEl.classList.add('selected');

        const dayBlocks = timeData[dateKey] || [];
        const actualHrs = dayBlocks
            .filter(b => (b.type || 'actual') === 'actual')
            .reduce((sum, b) => sum + (parseFloat(b.hours) || 0), 0);

        if (dayBlocks.length > 0) dayEl.classList.add('has-data');

        if (actualHrs > 0) {
            const totalEl = document.createElement('div');
            totalEl.className = 'day-total';
            totalEl.innerText = `${Number(actualHrs.toFixed(1))}h`;
            dayEl.appendChild(totalEl);
        }

        dayEl.onclick = () => {
            selectedDateStr = dateKey;
            refreshApp();
            
            // On mobile devices, open the full-screen daily drawer
            if (window.innerWidth < 900) {
                openMobileDailyModal(dateKey);
            }
        };

        grid.appendChild(dayEl);
    }
}

document.getElementById('prev-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Builds a single "Example" card shown whenever a day has nothing logged
// yet. It's styled and shaped exactly like a real time-block card so it
// teaches the format at a glance, but it's dashed, muted, tagged "Example",
// and has no click/delete handlers wired up - it's not real data and can
// never be mistaken for or accidentally interacted with as if it were.
function buildExampleActivityCard() {
    const card = document.createElement('div');
    card.className = 'time-block example-block';
    card.innerHTML = `
        <div class="time-block-pill">2h</div>
        <div class="time-block-info">
            <div class="time-block-top">
                <strong class="time-block-cat">Coding</strong>
                <span class="example-badge">Example</span>
            </div>
            <div class="time-block-desc">Worked on the website homepage</div>
        </div>
        <div class="time-block-side">
            <span class="time-block-time">09:00 to 11:00</span>
        </div>
    `;
    return card;
}

// --- DAY SCHEDULE STACK ---
function renderDayScheduleStack() {
    const desktopContainer = document.getElementById('timeline-container');
    const desktopSummary = document.getElementById('hours-summary');
    const desktopTitle = document.getElementById('selected-date-title');
    const desktopFilterInput = document.getElementById('day-category-filter');

    const mobileContainer = document.getElementById('mobile-timeline-container');
    const mobileSummary = document.getElementById('mobile-hours-summary');
    const mobileFilterInput = document.getElementById('mobile-day-category-filter');

    if (desktopTitle) desktopTitle.innerText = t('activity.addTimeBlockTitle', { date: selectedDateStr });
    
    if (desktopContainer) desktopContainer.innerHTML = '';
    if (mobileContainer) mobileContainer.innerHTML = '';

    const blocks = timeData[selectedDateStr] || [];

    // Renders one surface (desktop or mobile) against its own filter -
    // desktop and mobile are separate views (you're generally using one
    // or the other, not both at once), so each gets its own independent
    // filter text rather than being forced to match.
    function renderSurface(container, summaryEl, totalsEl, filterInput) {
        if (!container) return;
        const filterText = (filterInput && filterInput.value.trim().toLowerCase()) || '';
        // Keep each block's ORIGINAL index into timeData[selectedDateStr]
        // even after filtering, so edit/delete still target the right
        // underlying entry regardless of how the filtered list re-orders
        // or shortens things.
        const filtered = blocks
            .map((block, index) => ({ block, index }))
            .filter(({ block }) => !filterText || (block.category || 'General').toLowerCase().includes(filterText));

        let filteredTotalHrs = 0;
        filtered.forEach(({ block, index }) => {
            filteredTotalHrs += parseFloat(block.hours || 0);
            const color = getCategoryColor(block.category);
            const isProjected = block.type === 'projected';

            const card = document.createElement('div');
            card.className = 'time-block';
            if (selectedBlockReference && selectedBlockReference.dateKey === selectedDateStr && selectedBlockReference.index === index) {
                card.classList.add('selected-block');
            }
            card.style.borderLeftColor = color;
            if (isProjected) card.style.opacity = '0.65';

            card.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(selectedDateStr, index, e);
            });

            const hoursLabel = Number(block.hours || 0).toFixed(Number(block.hours || 0) % 1 === 0 ? 0 : 1);
            card.innerHTML = `
                <div class="time-block-pill" style="background:${color};">${hoursLabel}h</div>
                <div class="time-block-info">
                    <div class="time-block-top">
                        <strong class="time-block-cat" style="color:${color}">${escapeHtml(block.category || 'General')}</strong>
                        ${isProjected ? '<span title="Planned">🌫️</span>' : ''}
                    </div>
                    <div class="time-block-desc">${escapeHtml(block.name || 'No description')}</div>
                </div>
                <div class="time-block-side">
                    <span class="time-block-time">${block.timeRange || ''}</span>
                    <span class="time-block-edit-hint" title="Tap to edit">✎</span>
                    <div class="block-actions">
                        ${isProjected ? `<button class="done-btn" onclick="event.stopPropagation(); toggleBlockPlane('${selectedDateStr}', ${index})" title="Mark as Done">✅</button>` : ''}
                        <button class="del-btn" onclick="event.stopPropagation(); deleteBlock('${selectedDateStr}', ${index})" title="Delete">✕</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        if (filtered.length === 0) {
            if (filterText) {
                container.innerHTML = `<div class="mobile-day-empty">No "${escapeHtml(filterText)}" activities today.</div>`;
            } else {
                if (container === desktopContainer) container.appendChild(buildExampleActivityCard());
                else {
                    container.innerHTML = '<div class="mobile-day-empty">No activities logged yet.</div>';
                    container.appendChild(buildExampleActivityCard());
                }
            }
        }

        if (summaryEl) {
            summaryEl.innerText = filterText
                ? `${filterInput.value.trim()}: ${filteredTotalHrs.toFixed(2)} hrs`
                : t('log.loggedToday', { hours: filteredTotalHrs.toFixed(2) });
        }

        // Category pills only make sense for the unfiltered ("show
        // everything") view - once you've filtered down to one
        // category, the single summary line above already says
        // everything the pills would.
        if (totalsEl) {
            if (filterText) {
                totalsEl.innerHTML = '';
            } else {
                const categoryTotals = {};
                blocks.forEach(block => {
                    if ((block.type || 'actual') !== 'actual') return;
                    const cat = block.category || 'General';
                    categoryTotals[cat] = (categoryTotals[cat] || 0) + (parseFloat(block.hours) || 0);
                });
                const sortedTotals = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
                totalsEl.innerHTML = sortedTotals.map(([cat, hrs]) => {
                    const color = getCategoryColor(cat);
                    const hoursLabel = hrs.toFixed(hrs % 1 === 0 ? 0 : 1);
                    return `<div class="category-day-total-pill" style="border-color:${color};"><span style="color:${color};">${escapeHtml(cat)}</span> · ${hoursLabel}h</div>`;
                }).join('');
            }
        }

        return filteredTotalHrs;
    }

    renderSurface(desktopContainer, desktopSummary, document.getElementById('category-day-totals'), desktopFilterInput);
    const mobileFilteredTotal = renderSurface(mobileContainer, mobileSummary, document.getElementById('mobile-category-day-totals'), mobileFilterInput);

    const sheetSub = document.getElementById('mobile-sheet-subtitle');
    if (sheetSub) {
        const fullDayTotal = blocks.reduce((s, b) => s + parseFloat(b.hours || 0), 0);
        sheetSub.innerText = `${fullDayTotal.toFixed(2)} / 24 Hours`;
    }
}

// --- MOBILE DAILY MODAL CONTROLS ---
// A stripped-down "zoomed in on one day" view of the calendar: just the
// date, an Add Activity button (opens the same quick-add modal used
// elsewhere), and the list of whatever's already logged for that day.
// Anything added here writes straight into timeData, so it shows up on
// the big month calendar immediately too - this is just a single-day
// slice of the same data, not a separate form.
function openMobileDailyModal(dateKey) {
    const modal = document.getElementById('mobile-daily-modal');
    const sheetTitle = document.getElementById('mobile-sheet-title');

    if (sheetTitle) {
        const parts = dateKey.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        sheetTitle.innerText = `${parts[2]} ${days[d.getDay()]}`;
    }

    renderDayScheduleStack();
    if (modal) modal.style.display = 'flex';
}

function closeMobileDailyModal() {
    const modal = document.getElementById('mobile-daily-modal');
    if (modal) modal.style.display = 'none';
}

function openMobileAddModal() {
    openQuickAddModal(selectedDateStr, getNextAvailableHour(selectedDateStr));
}

function setSelectedBlock(dateKey, index) {
    selectedBlockReference = { dateKey, index };
    selectedBacklogId = null;
    refreshApp();
}

function clearSelectedBlock() {
    selectedBlockReference = null;
    selectedBacklogId = null;
    refreshApp();
}

function setSelectedBacklogItem(id) {
    selectedBacklogId = id;
    selectedBlockReference = null;
    refreshApp();
}

function deleteBlock(dateKey, index) {
    if (timeData[dateKey]) {
        timeData[dateKey].splice(index, 1);
        if (timeData[dateKey].length === 0) delete timeData[dateKey];
        if (selectedBlockReference && selectedBlockReference.dateKey === dateKey && selectedBlockReference.index === index) {
            selectedBlockReference = null;
        }
        saveData();
        refreshApp();
    }
}

function toggleBlockPlane(dateKey, index) {
    if (timeData[dateKey] && timeData[dateKey][index]) {
        const current = timeData[dateKey][index].type || 'actual';
        timeData[dateKey][index].type = (current === 'projected') ? 'actual' : 'projected';
        saveData();
        refreshApp();
    }
}

// --- LIVE TIMER (chronometer-driven calendar block) ---
// Instead of picking a start/end time up front, this starts a block
// "now" on today's column and grows it in real time for as long as
// it's running - press Start, work, press Pause when you step away,
// Resume to keep going, Finish to lock it in as a normal completed
// block with whatever the total came out to.
//
// Only one of these can be active (running or paused-but-unfinished) at
// a time - starting a second one before finishing the first would mean
// two blocks both claiming to represent "what I'm doing right now",
// which doesn't really make sense. Reference to the current one:
let activeLiveTimerRef = null; // { dateKey, index } - kept in sync with whichever block in timeData has an unfinished liveTimer

function findActiveLiveTimer() {
    for (const dateKey in timeData) {
        const blocks = timeData[dateKey];
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].liveTimer && !blocks[i].liveTimer.finished) {
                return { dateKey, index: i };
            }
        }
    }
    return null;
}

// Shared by both ways to start a chronometer: the always-"right now"
// button in the bar above the calendar, and "Start Live Chronometer
// Here" in the Add Activity modal, which uses whatever date/time/
// category/notes you'd already filled in there - so you get to choose
// exactly where it lands, the same way any other activity you add gets
// placed wherever you clicked.
function beginLiveTimer(dateKey, startHour, startMin, category, name) {
    if (activeLiveTimerRef) {
        showSaveToast('⚠️ Finish your current activity first', false);
        setTimeout(() => showSaveToast('', false), 2000);
        return false;
    }
    if (!timeData[dateKey]) timeData[dateKey] = [];

    timeData[dateKey].push({
        category: category || 'General',
        name: name || '',
        type: 'actual',
        liveTimer: {
            startHour,
            startMin,
            runningSince: Date.now(),
            accumulatedMs: 0,
            finished: false
        }
    });

    activeLiveTimerRef = { dateKey, index: timeData[dateKey].length - 1 };
    saveData();
    refreshApp();
    renderLiveTimerWidget();
    syncStopwatchWithLiveTimer();
    return true;
}

function startLiveTimerActivity(triggerEl) {
    const bar = triggerEl ? triggerEl.closest('.live-timer-bar') : document.querySelector('.live-timer-bar');
    const catInput = bar ? bar.querySelector('.live-timer-category-input-el') : null;
    const notesInput = bar ? bar.querySelector('.live-timer-notes-input-el') : null;
    const category = (catInput && catInput.value.trim()) || 'General';
    const name = (notesInput && notesInput.value.trim()) || '';
    const now = new Date();
    const started = beginLiveTimer(formatDateKey(now), now.getHours(), now.getMinutes(), category, name);
    if (started) {
        // Clear both bars' inputs, not just the one that was used - now
        // that a session is active, every bar switches to showing its
        // active state anyway, so this just keeps things tidy for
        // whenever the next one starts.
        document.querySelectorAll('.live-timer-category-input-el, .live-timer-notes-input-el').forEach(el => el.value = '');
    }
}

// Reads the same Category/Notes/Date/Start Time fields already filled
// in on the Add Activity modal and starts the chronometer exactly
// there, instead of always at "right now" - this is what gives you the
// same positional control over a live timer that you already have for
// a normal fixed-duration activity.
function startLiveTimerFromModal() {
    const category = (document.getElementById('modal-category-name').value || '').trim();
    const name = (document.getElementById('modal-activity-name').value || '').trim();
    const dateInput = document.getElementById('modal-date-input');
    const dateKey = (dateInput && dateInput.value) || formatDateKey(new Date());
    const [startH, startM] = (document.getElementById('modal-start-time').value || '09:00').split(':').map(Number);

    const started = beginLiveTimer(dateKey, startH, startM || 0, category, name);
    if (started) closeQuickAddModal();
}

// Same idea as startLiveTimerFromModal() above, but for the desktop
// Log Time card - uses whatever category/notes/start time are already
// filled in there as the exact spot to start the chronometer, instead
// of always starting at "right now".
function startLiveTimerFromCard() {
    const category = (document.getElementById('category-name').value || '').trim();
    const name = (document.getElementById('activity-name').value || '').trim();
    const [startH, startM] = (document.getElementById('start-time').value || '09:00').split(':').map(Number);
    beginLiveTimer(selectedDateStr, startH, startM || 0, category, name);
}

function pauseResumeLiveTimer() {
    if (!activeLiveTimerRef) return;
    const block = timeData[activeLiveTimerRef.dateKey] && timeData[activeLiveTimerRef.dateKey][activeLiveTimerRef.index];
    if (!block || !block.liveTimer) return;

    if (block.liveTimer.runningSince) {
        // Currently running -> pause: fold the just-finished running
        // stretch into accumulatedMs and stop the clock.
        block.liveTimer.accumulatedMs += Date.now() - block.liveTimer.runningSince;
        block.liveTimer.runningSince = null;
    } else {
        // Currently paused -> resume: start a new running stretch from
        // now, on top of whatever was already accumulated.
        block.liveTimer.runningSince = Date.now();
    }
    saveData();
    refreshApp();
    renderLiveTimerWidget();
    syncStopwatchWithLiveTimer();
}

function finishLiveTimer() {
    if (!activeLiveTimerRef) return;
    const block = timeData[activeLiveTimerRef.dateKey] && timeData[activeLiveTimerRef.dateKey][activeLiveTimerRef.index];
    if (!block || !block.liveTimer) { activeLiveTimerRef = null; renderLiveTimerWidget(); return; }

    const totalMs = block.liveTimer.accumulatedMs + (block.liveTimer.runningSince ? Date.now() - block.liveTimer.runningSince : 0);
    const totalHours = Math.max(totalMs / 3600000, 0.05); // floor of 3 min so a near-instant Finish doesn't leave a literally invisible block

    const startH = block.liveTimer.startHour;
    const startM = block.liveTimer.startMin;
    const endTotalMins = Math.min(23 * 60 + 59, (startH * 60 + startM) + Math.round(totalHours * 60));
    const endH = Math.floor(endTotalMins / 60);
    const endM = endTotalMins % 60;

    block.hours = Math.round(totalHours * 100) / 100;
    block.timeRange = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')} to ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    block.liveTimer.finished = true;
    block.liveTimer.runningSince = null;

    activeLiveTimerRef = null;
    saveData();
    refreshApp();
    renderLiveTimerWidget();
    syncStopwatchWithLiveTimer();
    showSaveToast(`Logged ${timeToString(totalMs).slice(0, 8)} to ${block.category} ✓`, false);
    setTimeout(() => showSaveToast('', false), 2500);
}

// Single shared interval driving both the widget's live elapsed-time
// text and the growing calendar block, ticking every second. Cheap even
// long-term since there's at most one active timer at a time (only 1-2
// DOM elements touched per tick, not a full calendar re-render).
setInterval(() => {
    updateTodayNowLine(); // ticks every second regardless of timer state - it's just a clock

    if (!activeLiveTimerRef) return;
    const block = timeData[activeLiveTimerRef.dateKey] && timeData[activeLiveTimerRef.dateKey][activeLiveTimerRef.index];
    if (!block || !block.liveTimer || block.liveTimer.finished) { activeLiveTimerRef = null; return; }

    const elapsedMs = block.liveTimer.accumulatedMs + (block.liveTimer.runningSince ? Date.now() - block.liveTimer.runningSince : 0);

    const elapsedEl = document.getElementById('live-timer-active-elapsed');
    if (elapsedEl) elapsedEl.textContent = timeToString(elapsedMs).slice(0, 8);
    if (stopwatchLinkedToToday && typeof syncStopwatchWithLiveTimer === 'function') syncStopwatchWithLiveTimer();

    // Only actually grow the block's height while running - paused
    // means the number on screen keeps showing the frozen total, but
    // nothing moves, which is the visual cue for "paused" alongside the
    // dot animation stopping.
    if (block.liveTimer.runningSince) {
        // querySelectorAll, not querySelector: if today is in the big
        // calendar's currently-visible week, the SAME running block now
        // renders in two places at once (the Today strip and the big
        // calendar), since both build their columns with the same
        // buildDayColumnEl(). Only updating the first match would leave
        // whichever one isn't first looking frozen.
        document.querySelectorAll(`.visual-block[data-timer-date="${activeLiveTimerRef.dateKey}"][data-timer-index="${activeLiveTimerRef.index}"]`)
            .forEach(el => { el.style.height = `${Math.max((elapsedMs / 3600000) * 40, 4)}px`; });
    }
}, 1000);

function renderLiveTimerWidget() {
    const bars = document.querySelectorAll('.live-timer-bar');
    if (bars.length === 0) return;

    bars.forEach(bar => {
        const idleEl = bar.querySelector('[data-role="idle"]');
        const activeEl = bar.querySelector('[data-role="active"]');
        if (!idleEl || !activeEl) return;

        // The bar only shows at all once "Linked to Today" is on - or
        // if there's actually a session running/paused right now
        // (keeps it visible/controllable even if the toggle gets
        // flipped back off mid-session, rather than stranding an
        // active session with no way to see or finish it).
        if (!stopwatchLinkedToToday && !activeLiveTimerRef) {
            bar.style.display = 'none';
            return;
        }
        bar.style.display = '';

        if (!activeLiveTimerRef) {
            idleEl.style.display = 'flex';
            activeEl.style.display = 'none';
            return;
        }

        const block = timeData[activeLiveTimerRef.dateKey] && timeData[activeLiveTimerRef.dateKey][activeLiveTimerRef.index];
        if (!block || !block.liveTimer) {
            activeLiveTimerRef = null;
            idleEl.style.display = 'flex';
            activeEl.style.display = 'none';
            return;
        }

        idleEl.style.display = 'none';
        activeEl.style.display = 'flex';
        activeEl.classList.toggle('paused', !block.liveTimer.runningSince);

        const catEl = activeEl.querySelector('.live-timer-active-category');
        if (catEl) catEl.textContent = block.category;

        const notesEl = activeEl.querySelector('.live-timer-active-notes');
        if (notesEl) notesEl.textContent = block.name || '';

        const locEl = activeEl.querySelector('.live-timer-active-location');
        if (locEl) {
            const dateParts = activeLiveTimerRef.dateKey.split('-');
            const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            const monthNamesShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const startLabel = `${String(block.liveTimer.startHour).padStart(2,'0')}:${String(block.liveTimer.startMin).padStart(2,'0')}`;
            locEl.textContent = `· started ${startLabel}, ${monthNamesShort[d.getMonth()]} ${d.getDate()}`;
        }

        const elapsedMs = block.liveTimer.accumulatedMs + (block.liveTimer.runningSince ? Date.now() - block.liveTimer.runningSince : 0);
        const elapsedEl = activeEl.querySelector('.live-timer-active-elapsed');
        if (elapsedEl) elapsedEl.textContent = timeToString(elapsedMs).slice(0, 8);

        const pauseBtn = activeEl.querySelector('.live-timer-pause-btn');
        if (pauseBtn) pauseBtn.textContent = block.liveTimer.runningSince ? '⏸ Pause' : '▶ Resume';
    });
}

// --- ANALYTICS ---
function setRangeFilter(range, btn) {
    currentRangeFilter = range;
    customRangeFilter = null;
    hideTableFilterIndicator();
    document.querySelectorAll('.range-bar .range-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderAnalytics();
}

function handleCategorySearch(val) {
    activeCategoryFilter = val.toLowerCase().trim();
    renderAnalytics();
}

function isDateInRange(dateStr) {
    if (currentRangeFilter === 'all') return true;
    if (currentRangeFilter === 'day') return dateStr === selectedDateStr;

    const parts = dateStr.split('-');
    const itemDate = new Date(parts[0], parts[1] - 1, parts[2]);

    if (currentRangeFilter === 'custom' && customRangeFilter) {
        return itemDate >= customRangeFilter.start && itemDate <= customRangeFilter.end;
    }

    const selParts = selectedDateStr.split('-');
    const refDate = new Date(selParts[0], selParts[1] - 1, selParts[2]);

    if (currentRangeFilter === 'week') {
        const sunday = new Date(refDate);
        sunday.setDate(refDate.getDate() - refDate.getDay());
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        return itemDate >= sunday && itemDate <= saturday;
    }

    if (currentRangeFilter === 'month') {
        return itemDate.getFullYear() === refDate.getFullYear() && itemDate.getMonth() === refDate.getMonth();
    }

    return true;
}

// Shown above the sessions table after clicking a goal history bar, so it's
// clear what's being filtered and how to get back to the full list.
function showTableFilterIndicator(category, start, end) {
    const el = document.getElementById('table-filter-indicator');
    if (!el) return;
    const fmt = d => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    el.innerHTML = `
        <span>Showing <b>${escapeHtml(category)}</b> entries from <b>${fmt(start)} – ${fmt(end)}</b></span>
        <button type="button" class="table-filter-clear-btn" onclick="clearTableFilter()">Clear ✕</button>
    `;
    el.style.display = 'flex';
}

function hideTableFilterIndicator() {
    const el = document.getElementById('table-filter-indicator');
    if (el) el.style.display = 'none';
}

function clearTableFilter() {
    activeCategoryFilter = '';
    currentRangeFilter = 'day';
    customRangeFilter = null;
    const catFilterInput = document.getElementById('category-filter-input');
    if (catFilterInput) catFilterInput.value = '';
    document.querySelectorAll('.analytics-controls .range-bar .range-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    hideTableFilterIndicator();
    renderAnalytics();
}

// Jumps from a goal-history bar straight to that period's individual log
// entries for the clicked category - filtered to the exact date range the
// bar represents - and expands + scrolls to the sessions table so they're
// immediately visible and clickable to edit or delete, instead of only
// showing the aggregate total with no way to fix it short of deleting
// everything and starting over.
function openGoalBarEntries(category, rangeType, offsetIndex) {
    const { start, end } = rangeType === 'week' ? getWeekRangeOffset(offsetIndex) : getMonthRangeOffset(offsetIndex);

    customRangeFilter = { start, end };
    currentRangeFilter = 'custom';
    activeCategoryFilter = category.toLowerCase();

    const catFilterInput = document.getElementById('category-filter-input');
    if (catFilterInput) catFilterInput.value = category;
    document.querySelectorAll('.analytics-controls .range-bar .range-btn').forEach(b => b.classList.remove('active'));

    const analyticsSection = document.getElementById('analytics-details-section');
    const sessionsSection = document.getElementById('all-sessions-details-section');
    if (analyticsSection) analyticsSection.open = true;
    if (sessionsSection) sessionsSection.open = true;

    showTableFilterIndicator(category, start, end);
    renderAnalytics();

    const table = document.getElementById('details-table-container');
    if (table) {
        setTimeout(() => table.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
}

function renderAnalytics() {
    const grid = document.getElementById('category-grid'); // optional - Category Breakdown grid was removed in favor of the donut legend, but stays supported if a future view re-adds it
    const tableBody = document.getElementById('details-table-body');
    const totalVal = document.getElementById('table-total-value');
    if (!tableBody) return;

    if (grid) grid.innerHTML = '';
    tableBody.innerHTML = '';

    const catTotals = {};
    let grandTotal = 0;

    Object.keys(timeData).forEach(dateStr => {
        if (!isDateInRange(dateStr)) return;

        timeData[dateStr].forEach((item, itemIndex) => {
            if (activeCategoryFilter && !item.category.toLowerCase().includes(activeCategoryFilter) && !item.name.toLowerCase().includes(activeCategoryFilter)) {
                return;
            }

            const cat = item.category.toLowerCase() || 'general';
            const hrs = parseFloat(item.hours) || 0;

            catTotals[cat] = (catTotals[cat] || 0) + hrs;
            grandTotal += hrs;

            const tr = document.createElement('tr');
            tr.className = 'clickable-row';
            tr.title = 'Click to edit or delete';
            tr.onclick = (e) => openEditModal(dateStr, itemIndex, e);
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><span style="color:${getCategoryColor(cat)}; font-weight:bold;">${item.category}</span></td>
                <td>${item.name || '-'}</td>
                <td style="text-align: center;"><span class="plane-badge">${item.type === 'projected' ? 'Planned' : 'Completed'}</span></td>
                <td style="text-align:right;">${hrs.toFixed(2)}</td>
            `;
            tableBody.appendChild(tr);
        });
    });

    if (grid) {
        Object.keys(catTotals).forEach(cat => {
            const card = document.createElement('div');
            card.className = 'cat-card';
            card.style.borderTop = `3px solid ${getCategoryColor(cat)}`;
            card.innerHTML = `
                <div class="cat-card-title">${cat}</div>
                <div class="cat-card-value">${catTotals[cat].toFixed(2)} h</div>
            `;
            grid.appendChild(card);
        });
    }

    if (totalVal) totalVal.innerText = grandTotal.toFixed(2);
}

// --- GOAL TRACKING ---
// How many past periods to show in each trend chart (includes the current one).
const HISTORY_WEEKS = 4;
const HISTORY_MONTHS = 4;

// Returns the {start, end} Date bounds of the week that is `weeksAgo` weeks
// before the current real-world week (0 = this week, Sun-Sat).
function getWeekRangeOffset(weeksAgo) {
    const today = new Date();
    const currentSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const start = new Date(currentSunday.getFullYear(), currentSunday.getMonth(), currentSunday.getDate() - (weeksAgo * 7));
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
    return { start, end };
}

// Same idea for calendar months (0 = this month).
function getMonthRangeOffset(monthsAgo) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - monthsAgo + 1, 0, 23, 59, 59, 999);
    return { start, end };
}

// Sums logged "actual" hours for a category within an arbitrary date range.
function getCategoryHoursInDateRange(category, start, end) {
    let total = 0;
    Object.keys(timeData).forEach(dateStr => {
        const parts = dateStr.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (d < start || d > end) return;

        (timeData[dateStr] || []).forEach(item => {
            const cat = (item.category || 'general').toLowerCase();
            const type = item.type || 'actual';
            if (cat === category && type === 'actual') {
                total += parseFloat(item.hours) || 0;
            }
        });
    });
    return total;
}

// Convenience wrapper for "right now" (current week / current month) - used
// for the big ring at the top of each goal metric block.
function getCategoryHoursInRange(category, rangeType) {
    if (rangeType === 'week') {
        const { start, end } = getWeekRangeOffset(0);
        return getCategoryHoursInDateRange(category, start, end);
    }
    if (rangeType === 'month') {
        const { start, end } = getMonthRangeOffset(0);
        return getCategoryHoursInDateRange(category, start, end);
    }
    return 0;
}

function saveCategoryGoals() {
    localStorage.setItem('categoryGoals', JSON.stringify(categoryGoals));
    queueCloudSync();
}

// Sets (or updates) the weekly and/or monthly target hours for a category.
// Leaving one of the two hour fields blank keeps whatever target was
// already saved for that dimension instead of clearing it.
function setCategoryGoal() {
    const catInput = document.getElementById('goal-category');
    const weeklyInput = document.getElementById('goal-weekly-hours');
    const monthlyInput = document.getElementById('goal-monthly-hours');
    if (!catInput) return;

    const cat = catInput.value.trim().toLowerCase();
    if (!cat) return;

    const weeklyVal = parseFloat(weeklyInput.value);
    const monthlyVal = parseFloat(monthlyInput.value);
    const existing = categoryGoals[cat] || { weekly: null, monthly: null };

    const weekly = weeklyVal > 0 ? weeklyVal : existing.weekly;
    const monthly = monthlyVal > 0 ? monthlyVal : existing.monthly;

    if (!weekly && !monthly) return; // nothing to save

    categoryGoals[cat] = { weekly: weekly || null, monthly: monthly || null };
    saveCategoryGoals();

    catInput.value = '';
    weeklyInput.value = '';
    monthlyInput.value = '';

    renderGoals();
}

function deleteCategoryGoal(cat) {
    delete categoryGoals[cat];
    saveCategoryGoals();
    renderGoals();
}

// Builds the small trend chart under a goal ring: one vertical bar per past
// period (oldest on the left, current period on the right, outlined) so you
// can see at a glance whether you're improving week over week / month over
// month. Each bar shows its own short date label so it's clear which period
// it represents, and clicking a bar jumps straight to that period's
// individual log entries (filtered to this category) so they can be opened
// and edited directly instead of only seeing the totalled-up hours here.
function buildGoalHistoryBars(category, target, rangeType) {
    const count = rangeType === 'week' ? HISTORY_WEEKS : HISTORY_MONTHS;
    const catEscaped = category.replace(/'/g, "\\'");
    let bars = '';

    for (let i = count - 1; i >= 0; i--) {
        const { start, end } = rangeType === 'week' ? getWeekRangeOffset(i) : getMonthRangeOffset(i);
        const hrs = getCategoryHoursInDateRange(category, start, end);
        const pct = target > 0 ? Math.min(100, Math.round((hrs / target) * 100)) : 0;
        const isCurrent = i === 0;
        const fillColor = hrs >= target ? '#22c55e' : getCategoryColor(category);
        const dateLabel = rangeType === 'week'
            ? start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : start.toLocaleDateString(undefined, { month: 'short' });

        bars += `
            <div class="goal-history-bar-wrap" title="${dateLabel}: ${hrs.toFixed(1)} / ${target} hrs (${pct}%) - click to view & edit these entries" onclick="openGoalBarEntries('${catEscaped}', '${rangeType}', ${i})">
                <div class="goal-history-bar-date">${dateLabel}</div>
                <div class="goal-history-bar-track">
                    <div class="goal-history-bar-fill${isCurrent ? ' current' : ''}" style="height:${pct}%; background:${fillColor};"></div>
                </div>
                <div class="goal-history-bar-pct">${pct}%</div>
            </div>
        `;
    }

    const periodWord = rangeType === 'week' ? 'weeks' : 'months';
    return `
        <div class="goal-history-label">Last ${count} ${periodWord} · tap a bar to view &amp; edit its entries</div>
        <div class="goal-history-row">${bars}</div>
    `;
}

// Builds one full goal metric block: the live progress ring for the current
// week/month up top, plus the week-by-week (or month-by-month) trend chart
// underneath it.
function buildGoalMetricBlock(label, historyLabel, current, target, color, rangeType, category) {
    const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const ringColor = current >= target ? '#22c55e' : color;

    return `
        <div class="goal-metric-block">
            <div class="goal-metric-top">
                <svg class="goal-ring-svg" viewBox="0 0 56 56">
                    <circle class="goal-ring-track" cx="28" cy="28" r="${radius}"></circle>
                    <circle class="goal-ring-progress" cx="28" cy="28" r="${radius}"
                        style="stroke:${ringColor}; stroke-dasharray:${circumference}; stroke-dashoffset:${offset};"></circle>
                    <text x="28" y="32" class="goal-ring-text">${pct}%</text>
                </svg>
                <div class="goal-metric-info">
                    <div class="goal-metric-label">${label}</div>
                    <div class="goal-metric-hrs">${current.toFixed(1)} / ${target} hrs</div>
                </div>
            </div>
            ${buildGoalHistoryBars(category, target, rangeType)}
        </div>
    `;
}

// Renders one card per category that has a goal, each with a weekly and/or
// monthly progress ring plus its trend history. Called from refreshApp() so
// it stays in sync automatically whenever any activity is added, edited,
// moved, or deleted.
function renderGoals() {
    const grid = document.getElementById('goals-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const cats = Object.keys(categoryGoals).filter(c => categoryGoals[c].weekly || categoryGoals[c].monthly);

    if (cats.length === 0) {
        grid.innerHTML = `<div class="goals-empty-msg">No goals set yet. Enter a category and a weekly and/or monthly target above to start tracking progress.</div>`;
        return;
    }

    cats.forEach(cat => {
        const goal = categoryGoals[cat];
        const color = getCategoryColor(cat);

        const card = document.createElement('div');
        card.className = 'goal-card';
        card.style.borderTop = `3px solid ${color}`;

        let blocksHtml = '';
        if (goal.weekly) {
            blocksHtml += buildGoalMetricBlock('This Week', '', getCategoryHoursInRange(cat, 'week'), goal.weekly, color, 'week', cat);
        }
        if (goal.monthly) {
            blocksHtml += buildGoalMetricBlock('This Month', '', getCategoryHoursInRange(cat, 'month'), goal.monthly, color, 'month', cat);
        }

        card.innerHTML = `
            <div class="goal-card-header">
                <span class="goal-card-title">${cat}</span>
                <button class="goal-delete-btn" onclick="deleteCategoryGoal('${cat}')" title="Remove goal">✕</button>
            </div>
            <div class="goal-metrics-col">${blocksHtml}</div>
        `;

        grid.appendChild(card);
    });
}

// --- MOBILE DOUBLE-TAP SUPPORT ---
// Touch devices don't reliably fire native 'dblclick' from two taps, so this
// detects two touchend events on the same element within 350ms and calls
// the handler manually, running the same code path desktop's dblclick uses.
function addDoubleTapListener(el, handler) {
    let lastTapTime = 0;

    el.addEventListener('touchend', (e) => {
        const now = Date.now();

        if (now - lastTapTime < 350) {
            e.preventDefault();
            const touch = e.changedTouches[0];
            handler({
                clientX: touch ? touch.clientX : 0,
                clientY: touch ? touch.clientY : 0,
                stopPropagation: () => {},
                preventDefault: () => {}
            });
            lastTapTime = 0;
        } else {
            lastTapTime = now;
        }
    });
}

// --- VISUAL CALENDAR MATRIX WITH TWO-PLANE SUPPORT ---
let draggedBlockInfo = null;

// Set true for the duration of any touch gesture that started on a
// .visual-block or its resize-handle (from touchstart to touchend/cancel),
// regardless of whether that gesture ends up being a drag, a resize, a
// long-press, or falls through to a scroll. The big calendar's own
// touch-driven horizontal scroll (setupBigCalendarHorizontalScroll below)
// checks this flag and stays out of the way while it's true, so the two
// touch handlers never fight over the same gesture.
let calendarBlockGestureActive = false;

// Builds one fully interactive day column (hourly slots + every
// activity block for that date, with all its handlers: click to
// select, double-tap/double-click to move-arm or edit, drag to move,
// drag the resize handle to resize, long-press for the context menu,
// live-timer growth). Extracted out of renderVisualMatrix() so the
// exact same interactive column can be reused for the Today strip
// (see renderTodayStrip) without duplicating this logic - both are
// genuinely the same code, not two versions that could drift apart.
function buildDayColumnEl(dateKey) {
        const dayCol = document.createElement('div');
        dayCol.className = 'matrix-day-col';
        dayCol.dataset.date = dateKey;

        dayCol.addEventListener('dragover', (e) => e.preventDefault());
        dayCol.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedBlockInfo) return;

            const colRect = dayCol.getBoundingClientRect();
            const rawY = e.clientY - colRect.top - (draggedBlockInfo.grabOffsetY || 0);
            const rawMinutes = (rawY / 40) * 60;
            const snappedMinutes = Math.max(0, Math.min(23 * 60 + 45, Math.round(rawMinutes / 15) * 15));

            const targetHour = Math.floor(snappedMinutes / 60);
            const targetMins = snappedMinutes % 60;

            if (draggedBlockInfo.source === 'backlog') {
                placeBacklogItemOnCalendar(draggedBlockInfo.backlogId, dayCol.dataset.date, targetHour, targetMins);
            } else {
                moveTimeBlockAbsolute(draggedBlockInfo.sourceDate, draggedBlockInfo.index, dayCol.dataset.date, targetHour, targetMins);
            }
            draggedBlockInfo = null;
        });

        for (let h = 0; h < 24; h++) {
            const slot = document.createElement('div');
            slot.className = 'matrix-slot';
            slot.dataset.hour = h;

            slot.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                openQuickAddModal(dateKey, h, e);
            });
            addDoubleTapListener(slot, (e) => openQuickAddModal(dateKey, h, e));

            dayCol.appendChild(slot);
        }

        const blocks = timeData[dateKey] || [];
        let autoHourOffset = 9;

        blocks.forEach((block, index) => {
            const blockType = block.type || 'actual';

            if (activePlaneFilter !== 'all' && blockType !== activePlaneFilter) {
                return;
            }

            if (hiddenCategories.some(c => c.toLowerCase() === (block.category || 'general').toLowerCase())) {
                return;
            }

            // A block still being driven by an active (unfinished) live
            // timer computes its own position/height from the timer's
            // fields directly, instead of a fixed timeRange - see
            // startLiveTimerActivity()/tickLiveTimers() further down.
            const isLiveTimer = !!(block.liveTimer && !block.liveTimer.finished);
            let topPx, heightPx;
            // Declared here (not nested inside the else branch below) on
            // purpose - the resize-handle drag closures further down
            // this same block-building code close over startH/startM by
            // reference, and need them in scope regardless of which
            // branch actually set them. Nesting them inside the else
            // block previously made them invisible outside it, which
            // silently broke resizeTimeBlock() from ever being called
            // (a ReferenceError inside the mouseup handler, swallowed
            // with no visible error) - the resize would show correctly
            // while dragging, then snap back to its old size on the
            // next render since nothing had actually been saved.
            let startH = 0, startM = 0;

            if (isLiveTimer) {
                startH = block.liveTimer.startHour;
                startM = block.liveTimer.startMin;
                topPx = (startH * 40) + ((startM / 60) * 40);
                const elapsedMs = block.liveTimer.accumulatedMs + (block.liveTimer.runningSince ? (Date.now() - block.liveTimer.runningSince) : 0);
                heightPx = Math.max((elapsedMs / 3600000) * 40, 4);
            } else {
                if (!block.timeRange) {
                    const autoStartH = autoHourOffset;
                    const autoEndH = Math.min(23, autoStartH + Math.ceil(block.hours || 1));
                    block.timeRange = `${String(autoStartH).padStart(2, '0')}:00 to ${String(autoEndH).padStart(2, '0')}:00`;
                    autoHourOffset = autoEndH;
                }

                const rangeParts = block.timeRange.split(' to ');
                if (rangeParts.length !== 2) return;

                const [rangeStartH, rangeStartM] = rangeParts[0].split(':').map(Number);
                const [endH, endM] = rangeParts[1].split(':').map(Number);
                startH = rangeStartH;
                startM = rangeStartM;

                topPx = (startH * 40) + ((startM / 60) * 40);
                const durationHrs = (endH + (endM / 60)) - (startH + (startM / 60));
                heightPx = Math.max(durationHrs * 40, 18);
            }

            const color = getCategoryColor(block.category);

            const vBlock = document.createElement('div');
            vBlock.className = `visual-block ${blockType}`;
            if (isLiveTimer) {
                vBlock.classList.add('live-timer-running');
                vBlock.dataset.timerDate = dateKey;
                vBlock.dataset.timerIndex = index;
            }
            if (selectedBlockReference && selectedBlockReference.dateKey === dateKey && selectedBlockReference.index === index) {
                vBlock.classList.add('selected-block');
            }
            if (armedMoveBlockRef && armedMoveBlockRef.dateKey === dateKey && armedMoveBlockRef.index === index) {
                vBlock.classList.add('move-armed');
            }
            vBlock.style.top = `${topPx}px`;
            vBlock.style.height = `${heightPx}px`;
            vBlock.style.backgroundColor = color;
            vBlock.style.cursor = isLiveTimer ? 'default' : 'grab';
            vBlock.draggable = !isLiveTimer;

            // Single-click/tap to select only — enables the move drag on
            // desktop and Ctrl+Delete/Supr without popping the edit box open
            // every time. Double-click/tap (below) is what opens the editor.
            vBlock.addEventListener('click', (e) => {
                e.stopPropagation();
                setSelectedBlock(dateKey, index);
            });

            // Double-tap on an existing activity now opens the same
            // quick-action menu long-press does (Move/Resize/Delete
            // first, Edit Details last - see the menu's own reordering)
            // rather than jumping straight to the edit-details form.
            // Double-tapping EMPTY space is unaffected - that's a
            // different listener entirely (on the hour slot, further
            // down) and still opens the create-new-activity modal.
            vBlock.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                openBlockContextMenu(e, dateKey, index, block.category, blockType);
            });
            addDoubleTapListener(vBlock, (e) => openBlockContextMenu(e, dateKey, index, block.category, blockType));

            // Right-click context menu
            vBlock.addEventListener('contextmenu', (e) => {
                openBlockContextMenu(e, dateKey, index, block.category, blockType);
            });

            vBlock.addEventListener('dragstart', (e) => {
                const blockRect = vBlock.getBoundingClientRect();
                draggedBlockInfo = { 
                    source: 'calendar',
                    sourceDate: dateKey, 
                    index: index, 
                    grabOffsetY: e.clientY - blockRect.top 
                };
                vBlock.style.opacity = '0.3';
            });

            vBlock.addEventListener('dragend', () => {
                vBlock.style.opacity = blockType === 'projected' ? '0.55' : '1';
            });

            // --- TOUCH: move + long-press (mirrors dragstart/drop and
            // contextmenu above, since neither HTML5 drag-and-drop nor
            // right-click work on touch devices). ---
            //
            // IMPORTANT: this used to hijack the gesture into a block-drag
            // the instant the finger moved more than 8px in ANY direction,
            // with .visual-block set to touch-action:none so the browser
            // never got a chance to scroll natively either. That meant any
            // swipe that started on top of a block (which, with wide
            // multi-day blocks, can be most of the visible grid) never
            // scrolled the big calendar - a plain flick was indistinguishable
            // from "start dragging this block". Now a quick swipe is left
            // alone (never preventDefault'ed) so the browser's native
            // scrolling - horizontal on the calendar's own scroller,
            // vertical on the page - just handles it, exactly like it does
            // over the empty (non-block) parts of the grid. Only a
            // deliberate press-and-hold (same 500ms used for the context
            // menu) "arms" the block; a hold that's then dragged repositions
            // the block, a hold that's released in place opens the context
            // menu, same as before.
            vBlock.addEventListener('touchstart', (e) => {
                if (e.target.closest('.resize-handle')) return;
                if (isLiveTimer) return; // don't let a touch-drag reposition a block that's being driven by an active timer

                const touch = e.touches[0];
                const rect = vBlock.getBoundingClientRect();
                const startX = touch.clientX;
                const startY = touch.clientY;
                const grabOffsetX = startX - rect.left;
                const grabOffsetY = startY - rect.top;
                let armed = false;      // long-press completed, ready to drag or open menu
                let dragging = false;   // actively repositioning the block
                let released = false;   // gesture ended (guards the timer firing late)
                const SCROLL_CANCEL_PX = 10; // movement beyond this before arming = treat as a scroll

                // Claim the gesture so the calendar's own scroll handler
                // (setupBigCalendarHorizontalScroll) leaves it alone while
                // we're deciding what it is - released the moment we decide
                // it's actually a swipe (below) so scrolling can take over.
                calendarBlockGestureActive = true;

                const beginDrag = () => {
                    dragging = true;
                    setSelectedBlock(dateKey, index);
                    vBlock.style.position = 'fixed';
                    vBlock.style.left = `${rect.left}px`;
                    vBlock.style.top = `${rect.top}px`;
                    vBlock.style.width = `${rect.width}px`;
                    vBlock.style.height = `${rect.height}px`;
                    vBlock.style.zIndex = '9999';
                    vBlock.style.opacity = '0.85';
                    vBlock.style.pointerEvents = 'none';
                };

                const longPressTimer = setTimeout(() => {
                    if (released) return;
                    armed = true;
                    if (navigator.vibrate) navigator.vibrate(30);
                }, 500);

                const onTouchMove = (moveEvt) => {
                    const t = moveEvt.touches[0];
                    const dx = t.clientX - startX;
                    const dy = t.clientY - startY;

                    if (dragging) {
                        moveEvt.preventDefault();
                        vBlock.style.left = `${t.clientX - grabOffsetX}px`;
                        vBlock.style.top = `${t.clientY - grabOffsetY}px`;
                        return;
                    }

                    if (armed) {
                        // Held still long enough, now moving: this is a drag.
                        moveEvt.preventDefault();
                        beginDrag();
                        vBlock.style.left = `${t.clientX - grabOffsetX}px`;
                        vBlock.style.top = `${t.clientY - grabOffsetY}px`;
                        return;
                    }

                    if (Math.abs(dx) > SCROLL_CANCEL_PX || Math.abs(dy) > SCROLL_CANCEL_PX) {
                        // Moved before the hold armed it - this is a swipe to
                        // scroll the calendar, not a drag. Back off entirely
                        // (never preventDefault) so the calendar's own
                        // scroll handler can pick this same gesture up from
                        // here, same as it would over a blank grid cell.
                        clearTimeout(longPressTimer);
                        document.removeEventListener('touchmove', onTouchMove);
                        document.removeEventListener('touchend', onTouchEnd);
                        calendarBlockGestureActive = false;
                    }
                };

                const onTouchEnd = (endEvt) => {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    clearTimeout(longPressTimer);
                    released = true;
                    calendarBlockGestureActive = false;

                    if (dragging) {
                        endEvt.preventDefault();
                        const touch2 = endEvt.changedTouches[0];
                        const dropTarget = document.elementFromPoint(touch2.clientX, touch2.clientY);
                        const targetCol = dropTarget ? dropTarget.closest('.matrix-day-col') : null;

                        if (targetCol) {
                            const colRect = targetCol.getBoundingClientRect();
                            const rawY = touch2.clientY - colRect.top - grabOffsetY;
                            const rawMinutes = (rawY / 40) * 60;
                            const snappedMinutes = Math.max(0, Math.min(23 * 60 + 45, Math.round(rawMinutes / 15) * 15));
                            const targetHour = Math.floor(snappedMinutes / 60);
                            const targetMins = snappedMinutes % 60;
                            moveTimeBlockAbsolute(dateKey, index, targetCol.dataset.date, targetHour, targetMins);
                        } else {
                            vBlock.style.position = '';
                            vBlock.style.left = '';
                            vBlock.style.top = `${topPx}px`;
                            vBlock.style.width = '';
                            vBlock.style.height = `${heightPx}px`;
                            vBlock.style.zIndex = '';
                            vBlock.style.pointerEvents = '';
                            vBlock.style.opacity = blockType === 'projected' ? '0.55' : '1';
                        }
                        return;
                    }

                    // Held still and released without dragging - open the
                    // context menu now (deferred from the timer so a
                    // press-then-swipe never fires it), suppressing the
                    // trailing synthetic click so it doesn't also pop the
                    // edit modal on top of it.
                    if (armed) {
                        endEvt.preventDefault();
                        openBlockContextMenu(
                            { clientX: startX, clientY: startY, preventDefault: () => {}, stopPropagation: () => {} },
                            dateKey, index, block.category, blockType
                        );
                        return;
                    }

                    // Plain quick tap (never armed, never dragged) - let the
                    // browser fire its normal click so the block's own click
                    // handler (edit modal) runs.
                };

                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
            });

            vBlock.innerHTML = `
                <div class="visual-block-title">${blockType === 'projected' ? '🌫️ ' : ''}${escapeHtml(block.category)}</div>
                <div style="font-size:0.65rem; line-height:1.1;">${escapeHtml(block.name || '')}</div>
                <div class="visual-block-time">${escapeHtml(block.timeRange)}</div>
                <div class="resize-handle"></div>
            `;

            // Resize handle
            const handle = vBlock.querySelector('.resize-handle');
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                vBlock.draggable = false;
                const startY = e.clientY;
                const startHeight = heightPx;

                const onMouseMove = (moveEvt) => {
                    const deltaY = moveEvt.clientY - startY;
                    const rawMins = ((startHeight + deltaY) / 40) * 60;
                    const snappedMins = Math.max(15, Math.round(rawMins / 15) * 15);
                    vBlock.style.height = `${(snappedMins / 60) * 40}px`;
                };

                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    vBlock.draggable = true;
                    resizeTimeBlock(dateKey, index, startH, startM, parseFloat(vBlock.style.height) / 40);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            // Touch resize — same logic as the mousedown handler above.
            handle.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault();
                calendarBlockGestureActive = true;
                const touch = e.touches[0];
                const startY = touch.clientY;
                const startHeight = heightPx;

                const onTouchMove = (moveEvt) => {
                    moveEvt.preventDefault();
                    const t = moveEvt.touches[0];
                    const deltaY = t.clientY - startY;
                    const rawMins = ((startHeight + deltaY) / 40) * 60;
                    const snappedMins = Math.max(15, Math.round(rawMins / 15) * 15);
                    vBlock.style.height = `${(snappedMins / 60) * 40}px`;
                };

                const onTouchEnd = () => {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    calendarBlockGestureActive = false;
                    resizeTimeBlock(dateKey, index, startH, startM, parseFloat(vBlock.style.height) / 40);
                };

                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
            }, { passive: false });

            dayCol.appendChild(vBlock);
        });

    // Live "now" line, only on today's own column - same visual/update
    // mechanism as the Today strip's line (see updateAllNowLines below),
    // since both the big calendar and the Today strip build their day
    // columns through this same shared function.
    if (dateKey === formatDateKey(new Date())) {
        const nowLine = document.createElement('div');
        nowLine.className = 'calendar-now-line';
        nowLine.innerHTML = '<span class="calendar-now-line-label"></span>';
        dayCol.appendChild(nowLine);

        // "Fill Gap" - if there's unlogged time between whatever was
        // last entered and right now (e.g. logged 3-4, it's now 7, and
        // you know you've just been doing one thing that whole time),
        // this is the one-button way to say so - opens the normal Add
        // Activity modal already pre-filled with that exact gap's start
        // and end time, so only category/notes are left to type in.
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const lastEndMinutes = getLatestActualBlockEndMinutes(dateKey);
        const gapMinutes = nowMinutes - lastEndMinutes;
        if (gapMinutes >= 10) { // ignore tiny/noise gaps under 10 min - not worth a button for those
            const gapZone = document.createElement('div');
            gapZone.className = 'calendar-fill-gap-zone';
            gapZone.style.top = `${(lastEndMinutes / 60) * 40}px`;
            gapZone.style.height = `${Math.max((gapMinutes / 60) * 40, 20)}px`;

            const gapBtn = document.createElement('button');
            gapBtn.type = 'button';
            gapBtn.className = 'calendar-fill-gap-btn';
            const gapLabel = gapMinutes >= 60 ? `${(gapMinutes / 60).toFixed(1)}h` : `${gapMinutes}m`;
            gapBtn.title = `Fill gap (${gapLabel})`;
            gapBtn.innerHTML = '<span>+</span>';

            // A single, direct tap/click always works now - the earlier
            // two-step "hold to reveal, then tap to confirm" was proving
            // unreliable on real devices, so this trades a little of the
            // original "completely invisible until hovered" look (see
            // .calendar-fill-gap-btn in the CSS - it now stays faintly
            // visible by default on touch) for something that just
            // works on the first try every time.
            const activate = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openGapFillModal(dateKey, lastEndMinutes, nowMinutes);
            };
            gapBtn.addEventListener('click', activate);
            gapBtn.addEventListener('touchend', activate);
            gapZone.appendChild(gapBtn);

            dayCol.appendChild(gapZone);
        }
    }

    return dayCol;
}

// The latest end time (in minutes since midnight) among today's real,
// completed activities - planned/projected blocks don't count, since
// the whole point is "what have I ACTUALLY been doing since then".
// Returns 0 (midnight) if nothing's logged yet today.
function getLatestActualBlockEndMinutes(dateKey) {
    const blocks = timeData[dateKey] || [];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let latest = 0;
    blocks.forEach(block => {
        if ((block.type || 'actual') !== 'actual' || !block.timeRange) return;
        const parts = block.timeRange.split(' to ');
        if (parts.length !== 2) return;
        const [endH, endM] = parts[1].split(':').map(Number);
        const endMinutes = endH * 60 + endM;
        // Only counts blocks that have ALREADY ended by now - a block
        // later than the current time (e.g. something logged ahead of
        // time) must never count as "the last thing that happened", or
        // the gap calculation goes negative and silently produces no
        // button anywhere on the page.
        if (endMinutes > latest && endMinutes <= nowMinutes) latest = endMinutes;
    });
    return latest;
}

// Opens the normal Add Activity modal, pre-filled with the exact gap
// boundaries (see the Fill Gap button above) - category/notes are the
// only thing left to fill in.
function openGapFillModal(dateKey, startMinutes, endMinutes) {
    const startH = Math.floor(startMinutes / 60), startM = startMinutes % 60;
    openQuickAddModal(dateKey, startH, null);
    const startInput = document.getElementById('modal-start-time');
    const endInput = document.getElementById('modal-end-time');
    if (startInput) startInput.value = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    if (endInput) {
        const endH = Math.floor(endMinutes / 60), endM = endMinutes % 60;
        endInput.value = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    }
}

// Renders the Today strip - a single-day mirror of the big calendar,
// sitting next to the Chronometer (see the HTML comment on that
// section for the full reasoning). Rebuilds its one day column using
// buildDayColumnEl(todayKey) - the exact same function the big weekly
// calendar uses for each of its 7 columns - so this is never a
// separate, could-drift-out-of-sync implementation; it's literally
// reading and writing the same timeData[todayKey] the big calendar
// does.
function renderTodayStrip() {
    const timeCol = document.getElementById('today-strip-time-col');
    const timeColRight = document.getElementById('today-strip-time-col-right');
    const dayWrap = document.getElementById('today-strip-day-wrap');
    const dateLabel = document.getElementById('today-strip-date-label');
    const nowLine = document.getElementById('today-now-line');
    if (!timeCol || !dayWrap) return;

    const now = new Date();
    const todayKey = formatDateKey(now);

    if (dateLabel) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dateLabel.textContent = `${dayNames[now.getDay()]}, ${monthNamesShort[now.getMonth()]} ${now.getDate()}`;
    }

    if (timeCol.children.length !== 24) {
        timeCol.innerHTML = '';
        for (let h = 0; h < 24; h++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot-label';
            slot.innerText = `${String(h).padStart(2, '0')}:00`;
            timeCol.appendChild(slot);
        }
    }
    // Mirrors the left-hand hour labels on the right edge too - same
    // reasoning as the big calendar (see renderVisualMatrix): once
    // this strip is scrolled or a phone screen is narrow, having hour
    // context on both sides means you're never without it.
    if (timeColRight && timeColRight.children.length !== 24) {
        timeColRight.innerHTML = '';
        for (let h = 0; h < 24; h++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot-label';
            slot.innerText = `${String(h).padStart(2, '0')}:00`;
            timeColRight.appendChild(slot);
        }
    }

    const existingDayCol = dayWrap.querySelector('.matrix-day-col');
    if (existingDayCol) existingDayCol.remove();
    const dayColEl = buildDayColumnEl(todayKey);
    // Insert before the now-line element (which is always the last
    // child of dayWrap) so the line visually sits on top of the column.
    dayWrap.insertBefore(dayColEl, nowLine);

    updateTodayNowLine();
}

// Positions the red "now" line at the correct height for the current
// time (40px per hour, matching the calendar's own scale) and updates
// its time label. Called on every full render, and also every tick of
// the existing live-timer interval below, so it drifts by at most a
// second or two even if you leave the tab open a long time.
function updateTodayNowLine() {
    const now = new Date();
    const minutesSinceMidnight = (now.getHours() * 60) + now.getMinutes();
    const topPx = (minutesSinceMidnight / 60) * 40;
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nowLine = document.getElementById('today-now-line');
    const label = document.getElementById('today-now-line-label');
    if (nowLine) {
        nowLine.style.top = `${topPx}px`;
        if (label) label.textContent = timeLabel;
    }

    // The big calendar's own now-line (see buildDayColumnEl) - only
    // exists on today's column, but querySelectorAll handles it
    // generically without needing to know which day that is here.
    document.querySelectorAll('.calendar-now-line').forEach(line => {
        line.style.top = `${topPx}px`;
        const lineLabel = line.querySelector('.calendar-now-line-label');
        if (lineLabel) lineLabel.textContent = timeLabel;
    });

    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const stopwatchLinkNowLabel = document.getElementById('stopwatch-link-now-label');
    if (stopwatchLinkNowLabel) stopwatchLinkNowLabel.textContent = `· ${monthNamesShort[now.getMonth()]} ${now.getDate()}, ${timeLabel}`;
}

function renderVisualMatrix() {
    const matrixGrid = document.getElementById('matrix-grid');
    if (!matrixGrid) return;

    matrixGrid.innerHTML = '';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const parts = selectedDateStr.split('-');
    const selDate = new Date(parts[0], parts[1] - 1, parts[2]);

    const sunday = new Date(selDate);
    sunday.setDate(selDate.getDate() - selDate.getDay());

    // Week nav label (below the grid) - "Aug 16 - Aug 22, 2026" style range
    // for whichever week is currently on screen.
    const weekNavLabel = document.getElementById('week-nav-label');
    if (weekNavLabel) {
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const startLabel = `${monthNamesShort[sunday.getMonth()]} ${sunday.getDate()}`;
        const endLabel = sunday.getMonth() === saturday.getMonth()
            ? `${saturday.getDate()}`
            : `${monthNamesShort[saturday.getMonth()]} ${saturday.getDate()}`;
        weekNavLabel.innerText = `${startLabel} – ${endLabel}, ${saturday.getFullYear()}`;
    }

    // Corner Header
    const timeHeader = document.createElement('div');
    timeHeader.className = 'matrix-header';
    timeHeader.innerText = 'Time';
    matrixGrid.appendChild(timeHeader);

    // Day Headers
    for (let i = 0; i < 7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        const header = document.createElement('div');
        header.className = 'matrix-header';
        if (formatDateKey(d) === selectedDateStr) {
            header.style.color = 'var(--accent)';
            header.style.fontWeight = 'bold';
        }
        header.innerText = `${days[i]} ${d.getDate()}`;
        matrixGrid.appendChild(header);
    }

    // Matching header cell for the right-hand hour column below (see
    // buildTimeColEl) - the grid has one extra column now, so this needs
    // to exist even empty or every column after it would shift over by
    // one on the content row.
    const timeHeaderRight = document.createElement('div');
    timeHeaderRight.className = 'matrix-header';
    timeHeaderRight.innerText = 'Time';
    matrixGrid.appendChild(timeHeaderRight);

    // Time Column - sticky to the left edge of the scroll container (see
    // .matrix-time-col in the CSS), so it's still visible however far
    // right you've scrolled instead of disappearing off-screen with
    // everything else.
    matrixGrid.appendChild(buildTimeColEl('left'));

    // 7 Day Columns
    for (let i = 0; i < 7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        const dateKey = formatDateKey(d);

        matrixGrid.appendChild(buildDayColumnEl(dateKey));
    }

    // Hour labels again on the right edge, sticky to THAT edge instead -
    // between the two, one of them is always in view no matter where
    // you've scrolled to, so you're never looking at a block without
    // knowing what hour it's at.
    matrixGrid.appendChild(buildTimeColEl('right'));
}

// The hour-label column (06:00, 07:00, ...) - built once and reused for
// both edges of the calendar grid (see renderVisualMatrix). Each side
// is sticky to its own edge of the scrolling container (see
// .matrix-time-col/.matrix-time-col-right in the CSS), so at least one
// of them stays on screen at any horizontal scroll position.
function buildTimeColEl(side) {
    const timeCol = document.createElement('div');
    timeCol.className = side === 'right' ? 'matrix-time-col matrix-time-col-right' : 'matrix-time-col';
    for (let h = 0; h < 24; h++) {
        const slot = document.createElement('div');
        slot.className = 'time-slot-label';
        slot.innerText = `${String(h).padStart(2, '0')}:00`;
        timeCol.appendChild(slot);
    }
    return timeCol;
}

// --- KEYBOARD LISTENER FOR DELETE / SUPR KEY / COPY / PASTE ---
document.addEventListener('keydown', (e) => {
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

    if ((e.key === 'Delete' || e.key === 'Supr') && !isTyping) {
        if (selectedBlockReference) {
            deleteBlock(selectedBlockReference.dateKey, selectedBlockReference.index);
        } else if (selectedBacklogId) {
            deleteBacklogItem(selectedBacklogId);
        }
    }

    if (e.key === 'Escape') {
        closeBlockContextMenu();
        closeQuickAddModal();
        closeMobileDailyModal();
        clearSelectedBlock();
    }

    const ctrlOrCmd = e.ctrlKey || e.metaKey;
    if (!isTyping && ctrlOrCmd && e.key.toLowerCase() === 'c') {
        const data = getSelectedBlockData();
        if (data) {
            clipboardBlockData = data;
            e.preventDefault();
        }
    }

    if (!isTyping && ctrlOrCmd && e.key.toLowerCase() === 'v') {
        if (clipboardBlockData) {
            pasteClipboardBlock();
            e.preventDefault();
        }
    }

    if (!isTyping && ctrlOrCmd && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
            redoLastAction();
        } else {
            undoLastAction();
        }
        e.preventDefault();
    }

    if (!isTyping && ctrlOrCmd && e.key.toLowerCase() === 'y') {
        redoLastAction();
        e.preventDefault();
    }
});

// Deselect on clicking empty background space
document.addEventListener('click', (e) => {
    if (!e.target.closest('.visual-block') && !e.target.closest('.time-block') && !e.target.closest('.modal-content') && !e.target.closest('.context-menu-content')) {
        if (selectedBlockReference || selectedBacklogId) {
            selectedBlockReference = null;
            selectedBacklogId = null;
            refreshApp();
        }
    }
});

// --- COPY / PASTE (Ctrl+C / Ctrl+V) ---
// Grabs a plain-data snapshot of whichever activity is currently selected,
// whether it lives on the big calendar or in the backlog strip.
function getSelectedBlockData() {
    if (selectedBlockReference) {
        const { dateKey, index } = selectedBlockReference;
        const item = timeData[dateKey] && timeData[dateKey][index];
        if (item) {
            return { category: item.category, name: item.name, hours: item.hours, type: item.type || 'actual' };
        }
    }
    if (selectedBacklogId) {
        const item = backlogItems.find(i => i.id === selectedBacklogId);
        if (item) {
            return { category: item.category, name: item.name, hours: item.hours, type: item.type || 'actual' };
        }
    }
    return null;
}

// Pastes clipboardBlockData wherever the mouse currently is: onto a calendar
// day column at that hour/quarter-hour, into the backlog strip, or (if the
// mouse isn't over either) as a fallback right after the selected date's
// last scheduled block.
function pasteClipboardBlock() {
    if (!clipboardBlockData) return;

    const hoveredEl = document.elementFromPoint(lastMouseX, lastMouseY);
    const dayCol = hoveredEl ? hoveredEl.closest('.matrix-day-col:not(.backlog-day-col)') : null;
    const overBacklog = hoveredEl ? hoveredEl.closest('.backlog-drawer') : null;

    if (dayCol) {
        const colRect = dayCol.getBoundingClientRect();
        const rawMinutes = ((lastMouseY - colRect.top) / 40) * 60;
        const snappedMinutes = Math.max(0, Math.min(23 * 60 + 45, Math.round(rawMinutes / 15) * 15));
        pasteBlockToCalendar(dayCol.dataset.date, Math.floor(snappedMinutes / 60), snappedMinutes % 60);
    } else if (overBacklog) {
        pasteBlockToBacklog();
    } else {
        pasteBlockToCalendar(selectedDateStr, getNextAvailableHour(selectedDateStr), 0);
    }
}

function pasteBlockToCalendar(targetDate, startHour, startMinutes) {
    const duration = clipboardBlockData.hours || 1;
    const totalStartMins = (startHour * 60) + startMinutes;
    const totalEndMins = Math.min(24 * 60 - 1, totalStartMins + Math.round(duration * 60));

    const newBlock = {
        category: clipboardBlockData.category,
        name: clipboardBlockData.name,
        hours: duration,
        timeRange: `${String(startHour).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')} to ${String(Math.floor(totalEndMins / 60)).padStart(2, '0')}:${String(totalEndMins % 60).padStart(2, '0')}`,
        type: clipboardBlockData.type || 'actual'
    };

    if (!timeData[targetDate]) timeData[targetDate] = [];
    timeData[targetDate].push(newBlock);

    saveData();
    refreshApp();
}

function pasteBlockToBacklog() {
    backlogItems.push({
        id: 'bl_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        category: clipboardBlockData.category,
        name: clipboardBlockData.name,
        hours: clipboardBlockData.hours || 1,
        type: clipboardBlockData.type || 'actual'
    });
    saveBacklogItems();
    renderBacklogList();
}

// --- CONTEXT MENU WITH PLANE CONVERSION ---
let contextBlockInfo = null;

function openBlockContextMenu(e, dateKey, index, category, currentType) {
    e.preventDefault();
    e.stopPropagation();

    contextBlockInfo = { dateKey, index, category, currentType };
    setSelectedBlock(dateKey, index);

    const menu = document.getElementById('block-context-menu');
    const content = menu?.querySelector('.context-menu-content');

    if (!menu || !content) return;

    const planeText = document.getElementById('context-plane-text');
    const planeIcon = document.getElementById('context-plane-icon');
    if (planeText && planeIcon) {
        if (currentType === 'projected') {
            planeText.innerText = 'Convert to Completed';
            planeIcon.innerText = '🎯';
        } else {
            planeText.innerText = 'Convert to Planned';
            planeIcon.innerText = '🌫️';
        }
    }

    menu.style.display = 'block';

    let left = e.clientX;
    let top = e.clientY;

    if (left + 240 > window.innerWidth) left = window.innerWidth - 250;
    if (top + 280 > window.innerHeight) top = window.innerHeight - 290;

    content.style.left = `${Math.max(10, left)}px`;
    content.style.top = `${Math.max(10, top)}px`;
}

function closeBlockContextMenu() {
    const menu = document.getElementById('block-context-menu');
    if (menu) menu.style.display = 'none';
    contextBlockInfo = null;
}

function editContextBlock() {
    if (!contextBlockInfo) return;
    const { dateKey, index } = contextBlockInfo;
    closeBlockContextMenu();
    openEditModal(dateKey, index, null);
}

// Arms the block for moving, same as before - just started explicitly
// from the menu now instead of a double-tap gesture that could
// conflict with double-tapping the same block again to cancel it. The
// actual move still shows the live drag preview (see updateDragGhost).
function moveContextBlock() {
    if (!contextBlockInfo) return;
    const { dateKey, index } = contextBlockInfo;
    closeBlockContextMenu();
    toggleArmedMoveBlock(dateKey, index);
}

// Opens the same reliable edit modal used everywhere else, focused on
// the End Time field specifically - deliberately not a drag gesture,
// since the whole point is that a small (e.g. 15-minute) block doesn't
// give a finger enough room to grab a resize handle precisely. Typing
// an end time works regardless of how visually small the block is.
function resizeContextBlock() {
    if (!contextBlockInfo) return;
    const { dateKey, index } = contextBlockInfo;
    closeBlockContextMenu();
    openEditModal(dateKey, index, null);
    setTimeout(() => {
        const endInput = document.getElementById('modal-end-time');
        if (endInput) { endInput.focus(); endInput.select(); }
    }, 50);
}

function toggleContextBlockPlane() {
    if (!contextBlockInfo) return;
    const { dateKey, index } = contextBlockInfo;
    toggleBlockPlane(dateKey, index);
    closeBlockContextMenu();
}

function deleteContextBlock() {
    if (!contextBlockInfo) return;
    deleteBlock(contextBlockInfo.dateKey, contextBlockInfo.index);
    closeBlockContextMenu();
}

function setCategoryCustomColor(colorHex) {
    if (!contextBlockInfo || !contextBlockInfo.category) return;
    const key = contextBlockInfo.category.toLowerCase();
    customCategoryColors[key] = colorHex;
    saveCustomCategoryColors();
    closeBlockContextMenu();
    refreshApp();
}

function resetCategoryDefaultColor() {
    if (!contextBlockInfo || !contextBlockInfo.category) return;
    const key = contextBlockInfo.category.toLowerCase();
    delete customCategoryColors[key];
    saveCustomCategoryColors();
    closeBlockContextMenu();
    refreshApp();
}

function saveCustomCategoryColors() {
    localStorage.setItem('customCategoryColors', JSON.stringify(customCategoryColors));
    queueCloudSync();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.context-menu-content')) closeBlockContextMenu();
});

// --- POPUP MODAL ---
function positionModalNearClick(clickEvent) {
    const modalContent = document.getElementById('quick-add-modal-content');
    if (!modalContent) return;

    if (window.innerWidth <= 768) {
        return; // Mobile positioning managed by CSS @media centered rule
    }

    const padding = 15;
    let x = clickEvent ? clickEvent.clientX + padding : window.innerWidth / 2 - 160;
    let y = clickEvent ? clickEvent.clientY + padding : window.innerHeight / 2 - 120;

    if (x + 280 > window.innerWidth) x = (clickEvent ? clickEvent.clientX : window.innerWidth / 2) - 295;
    if (y + 240 > window.innerHeight) y = (clickEvent ? clickEvent.clientY : window.innerHeight / 2) - 255;

    modalContent.style.left = `${Math.max(10, x)}px`;
    modalContent.style.top = `${Math.max(10, y)}px`;
}

function openQuickAddModal(dateKey, hour, clickEvent) {
    quickAddSlotInfo = { mode: 'add', dateKey, hour };
    const modal = document.getElementById('quick-add-modal');

    const modalCatInput = document.getElementById('modal-category-name');
    if (modalCatInput) modalCatInput.value = '';
    document.getElementById('modal-activity-name').value = '';
    // Pre-filled from the cell that was clicked, but left editable/clearable -
    // see submitQuickAddModal(), clearing it sends the item to the Backlog
    // instead of forcing it onto this date.
    const dateInput = document.getElementById('modal-date-input');
    if (dateInput) dateInput.value = dateKey || '';
    const dateGroup = document.getElementById('modal-date-group');
    if (dateGroup) dateGroup.style.display = '';
    setModalType(defaultEntryType);
    hideModalError();

    const startH = hour !== undefined ? hour : getNextAvailableHour(dateKey);
    const endH = Math.min(23, startH + 1);
    document.getElementById('modal-start-time').value = `${String(startH).padStart(2, '0')}:00`;
    document.getElementById('modal-end-time').value = `${String(endH).padStart(2, '0')}:00`;
    const durInput = document.getElementById('modal-duration-hours');
    if (durInput) durInput.value = '1';
    // Hours is the simpler default for a brand-new activity - typing "3"
    // beats picking an exact end clock time for most quick adds.
    setModalTimeMode('hours');

    const label = document.getElementById('modal-time-label');
    const submitBtn = document.getElementById('modal-submit-btn');
    const deleteBtn = document.getElementById('modal-delete-btn');
    const chronoBtn = document.getElementById('modal-start-chronometer-btn');
    if (label) label.innerText = t('activity.addTitle');
    if (submitBtn) { submitBtn.innerText = '+'; submitBtn.title = 'Add Time Block'; }
    if (deleteBtn) deleteBtn.style.display = 'none';
    if (chronoBtn) chronoBtn.style.display = activeLiveTimerRef ? 'none' : 'flex';

    if (modal) {
        modal.style.display = 'block';
        positionModalNearClick(clickEvent);
    }
}

function openEditModal(dateKey, index, clickEvent) {
    if (!timeData[dateKey] || !timeData[dateKey][index]) return;
    const item = timeData[dateKey][index];
    quickAddSlotInfo = { mode: 'edit', dateKey, index };

    const modal = document.getElementById('quick-add-modal');
    const modalCatInput = document.getElementById('modal-category-name');
    if (modalCatInput) modalCatInput.value = item.category || '';
    document.getElementById('modal-activity-name').value = item.name || '';
    const dateInput = document.getElementById('modal-date-input');
    if (dateInput) dateInput.value = dateKey || '';
    const dateGroup = document.getElementById('modal-date-group');
    if (dateGroup) dateGroup.style.display = '';
    setModalType(item.type || 'actual');
    hideModalError();

    // timeRange is always stored as "HH:MM to HH:MM" (both the simple-hours
    // and exact-time entry paths write it in this same format), so it can
    // be split straight back into the two time inputs. Older/imported
    // entries without one fall back to a sensible default.
    const [rangeStart, rangeEnd] = (item.timeRange || '09:00 to 10:00').split(' to ');
    document.getElementById('modal-start-time').value = rangeStart || '09:00';
    document.getElementById('modal-end-time').value = rangeEnd || '10:00';
    const durInput = document.getElementById('modal-duration-hours');
    if (durInput) durInput.value = item.hours || 1;
    // Exact by default here - an existing entry already has a precise
    // range worth preserving as-is, unlike a brand-new "add".
    setModalTimeMode('exact');

    const label = document.getElementById('modal-time-label');
    const submitBtn = document.getElementById('modal-submit-btn');
    const deleteBtn = document.getElementById('modal-delete-btn');
    const chronoBtn = document.getElementById('modal-start-chronometer-btn');
    if (label) label.innerText = t('activity.editTitle');
    if (submitBtn) { submitBtn.innerText = '✓'; submitBtn.title = 'Save changes'; }
    if (deleteBtn) deleteBtn.style.display = 'flex';
    if (chronoBtn) chronoBtn.style.display = 'none';

    if (modal) {
        modal.style.display = 'block';
        positionModalNearClick(clickEvent);
    }
}

// Opens the same quick-add/edit popup for a Backlog item (unscheduled -
// no date or clock time yet). The date field is hidden by default since
// there's nothing to show; filling it in and saving moves the item onto
// the calendar on that date, same as dragging it there.
function openBacklogEditModal(backlogId, clickEvent) {
    const item = backlogItems.find(i => i.id === backlogId);
    if (!item) return;
    quickAddSlotInfo = { mode: 'edit-backlog', backlogId };

    const modal = document.getElementById('quick-add-modal');
    const modalCatInput = document.getElementById('modal-category-name');
    if (modalCatInput) modalCatInput.value = item.category || '';
    document.getElementById('modal-activity-name').value = item.name || '';

    const dateInput = document.getElementById('modal-date-input');
    if (dateInput) dateInput.value = '';
    const dateGroup = document.getElementById('modal-date-group');
    if (dateGroup) dateGroup.style.display = 'none';

    setModalType(item.type || 'actual');
    hideModalError();

    // Backlog items only store a duration, not clock times - represent it
    // as a 09:00-start block of that length so the existing start/end
    // inputs (and the hours-from-times math in submitQuickAddModal) work
    // unchanged; the actual clock time is irrelevant until it's scheduled.
    const durationHrs = item.hours || 1;
    const endTotalMins = Math.min(23 * 60 + 59, (9 * 60) + Math.round(durationHrs * 60));
    document.getElementById('modal-start-time').value = '09:00';
    document.getElementById('modal-end-time').value = `${String(Math.floor(endTotalMins / 60)).padStart(2, '0')}:${String(endTotalMins % 60).padStart(2, '0')}`;
    const durInput = document.getElementById('modal-duration-hours');
    if (durInput) durInput.value = durationHrs;
    // A backlog item is really just a duration (no real clock time yet) -
    // Hours mode matches that directly.
    setModalTimeMode('hours');

    const label = document.getElementById('modal-time-label');
    const submitBtn = document.getElementById('modal-submit-btn');
    const deleteBtn = document.getElementById('modal-delete-btn');
    const chronoBtn = document.getElementById('modal-start-chronometer-btn');
    if (label) label.innerText = t('activity.editBacklogTitle');
    if (submitBtn) { submitBtn.innerText = '✓'; submitBtn.title = 'Save changes'; }
    if (deleteBtn) deleteBtn.style.display = 'flex';
    if (chronoBtn) chronoBtn.style.display = 'none';

    if (modal) {
        modal.style.display = 'block';
        positionModalNearClick(clickEvent);
    }
}

function deleteModalActivity() {
    if (!quickAddSlotInfo) return;
    if (quickAddSlotInfo.mode === 'edit') {
        deleteBlock(quickAddSlotInfo.dateKey, quickAddSlotInfo.index);
    } else if (quickAddSlotInfo.mode === 'edit-backlog') {
        deleteBacklogItem(quickAddSlotInfo.backlogId);
    } else {
        return;
    }
    closeQuickAddModal();
}

function closeQuickAddModal() {
    const modal = document.getElementById('quick-add-modal');
    if (modal) modal.style.display = 'none';
    quickAddSlotInfo = null;
    hideModalError();
}

function hideModalError() {
    const err = document.getElementById('modal-error-msg');
    if (err) err.style.display = 'none';
}

function showModalError(msg) {
    const err = document.getElementById('modal-error-msg');
    if (err) {
        err.innerText = msg;
        err.style.display = 'block';
    }
}

function submitQuickAddModal() {
    if (!quickAddSlotInfo) return;

    const category = document.getElementById('modal-category-name').value.trim() || 'General';
    const name = document.getElementById('modal-activity-name').value.trim();
    // Date is optional now - an empty value means "no date", so the item is
    // stored in the Backlog (unscheduled) instead of on a specific day.
    const dateVal = (document.getElementById('modal-date-input')?.value || '').trim();

    const startVal = document.getElementById('modal-start-time').value || '09:00';
    let endVal;
    if (modalTimeMode === 'hours') {
        const durHours = parseFloat(document.getElementById('modal-duration-hours').value) || 1;
        const [sH, sM] = startVal.split(':').map(Number);
        const totalMins = Math.min(24 * 60 - 1, (sH * 60 + sM) + Math.round(durHours * 60));
        endVal = `${String(Math.floor(totalMins / 60)).padStart(2, '0')}:${String(totalMins % 60).padStart(2, '0')}`;
    } else {
        endVal = document.getElementById('modal-end-time').value || '10:00';
    }
    const [sH, sM] = startVal.split(':').map(Number);
    const [eH, eM] = endVal.split(':').map(Number);
    const hours = (eH + eM / 60) - (sH + sM / 60);

    if (hours <= 0) {
        showModalError('End time must be after start time.');
        return;
    }

    const timeRange = `${startVal} to ${endVal}`;

    if (quickAddSlotInfo.mode === 'add') {
        if (dateVal) {
            if (!timeData[dateVal]) timeData[dateVal] = [];
            timeData[dateVal].push({ category, name, hours, timeRange, type: modalEntryType });
            saveData();
        } else {
            backlogItems.push({
                id: 'bl_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                category,
                name,
                hours,
                type: modalEntryType
            });
            saveBacklogItems();
        }
    } else if (quickAddSlotInfo.mode === 'edit') {
        const { dateKey, index } = quickAddSlotInfo;
        if (timeData[dateKey] && timeData[dateKey][index]) {
            if (!dateVal) {
                // Date cleared - move this item out of the calendar and into
                // the Backlog. One combined undo snapshot, same pattern as
                // sendCalendarBlockToBacklog().
                pushUndoSnapshot();
                const [item] = timeData[dateKey].splice(index, 1);
                if (timeData[dateKey].length === 0) delete timeData[dateKey];
                backlogItems.push({
                    id: 'bl_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    category,
                    name,
                    hours,
                    type: modalEntryType
                });
                localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
                localStorage.setItem('backlogItems', JSON.stringify(backlogItems));
                queueCloudSync();
            } else if (dateVal !== dateKey) {
                // Date changed - move the item to the new date key.
                pushUndoSnapshot();
                const [item] = timeData[dateKey].splice(index, 1);
                if (timeData[dateKey].length === 0) delete timeData[dateKey];
                if (!timeData[dateVal]) timeData[dateVal] = [];
                timeData[dateVal].push({ category, name, hours, timeRange, type: modalEntryType });
                localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
                queueCloudSync();
            } else {
                timeData[dateKey][index].category = category;
                timeData[dateKey][index].name = name;
                timeData[dateKey][index].type = modalEntryType;
                timeData[dateKey][index].hours = hours;
                timeData[dateKey][index].timeRange = timeRange;
                saveData();
            }
        }
    } else if (quickAddSlotInfo.mode === 'edit-backlog') {
        const { backlogId } = quickAddSlotInfo;
        const item = backlogItems.find(i => i.id === backlogId);
        if (item) {
            if (dateVal) {
                // A date was filled in - schedule it straight onto the
                // calendar on that date, same one-snapshot pattern as
                // placeBacklogItemOnCalendar().
                pushUndoSnapshot();
                backlogItems = backlogItems.filter(i => i.id !== backlogId);
                if (selectedBacklogId === backlogId) selectedBacklogId = null;
                if (!timeData[dateVal]) timeData[dateVal] = [];
                timeData[dateVal].push({ category, name, hours, timeRange, type: modalEntryType });
                localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
                localStorage.setItem('backlogItems', JSON.stringify(backlogItems));
                queueCloudSync();
            } else {
                // Still unscheduled - just update its fields in place.
                item.category = category;
                item.name = name;
                item.type = modalEntryType;
                item.hours = Math.round(hours * 100) / 100;
                saveBacklogItems();
            }
        }
    }

    closeQuickAddModal();
    refreshApp();
    renderBacklogList();
}

function resizeTimeBlock(dateKey, index, startH, startM, durationHrs) {
    if (!timeData[dateKey] || !timeData[dateKey][index]) return;
    const item = timeData[dateKey][index];

    const totalStartMins = (startH * 60) + startM;
    const totalEndMins = Math.min(24 * 60 - 1, totalStartMins + Math.round(durationHrs * 60));

    item.hours = Math.round(durationHrs * 100) / 100;
    item.timeRange = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')} to ${String(Math.floor(totalEndMins / 60)).padStart(2, '0')}:${String(totalEndMins % 60).padStart(2, '0')}`;

    saveData();
    refreshApp();
}

function moveTimeBlockAbsolute(sourceDate, index, targetDate, startHour, startMinutes) {
    if (!timeData[sourceDate] || !timeData[sourceDate][index]) return;

    const [item] = timeData[sourceDate].splice(index, 1);
    if (timeData[sourceDate].length === 0) delete timeData[sourceDate];

    const duration = item.hours || 1;
    const totalStartMins = (startHour * 60) + startMinutes;
    const totalEndMins = Math.min(24 * 60 - 1, totalStartMins + Math.round(duration * 60));

    item.timeRange = `${String(Math.floor(totalStartMins / 60)).padStart(2, '0')}:${String(totalStartMins % 60).padStart(2, '0')} to ${String(Math.floor(totalEndMins / 60)).padStart(2, '0')}:${String(totalEndMins % 60).padStart(2, '0')}`;

    if (!timeData[targetDate]) timeData[targetDate] = [];
    timeData[targetDate].push(item);

    saveData();
    refreshApp();
}

// Downloads EVERYTHING in the account (calendar time blocks, backlog,
// goals, category colors, all notes + notebooks) as one JSON file - so
// it can be brought into a brand new account via importData() below, or
// just kept as an offline backup. Used to only ever include timeData
// (the calendar), silently leaving notes/backlog/goals/notebooks behind
// - which made it useless as an actual "export everything" for exactly
// the "start a new account" use case it's for.
function exportData() {
    const payload = {
        exportedFrom: 'Lodge Time Budgeter',
        exportedAt: new Date().toISOString(),
        ...buildSyncPayload()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lodge_time_budgeter_backup_${formatDateKey(new Date())}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSaveToast('Backup downloaded', false);
    setTimeout(() => showSaveToast('', false), 1500);
}

async function importData(event) {
    const file = event.target.files[0];
    event.target.value = ''; // so picking the same file again still fires change
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        let imported;
        try {
            imported = JSON.parse(e.target.result);
        } catch (err) {
            showSaveToast('⚠️ That file is not valid JSON', false);
            setTimeout(() => showSaveToast('', false), 3000);
            return;
        }
        if (typeof imported !== 'object' || imported === null) {
            showSaveToast('⚠️ That file is not a valid backup', false);
            setTimeout(() => showSaveToast('', false), 3000);
            return;
        }

        // Accept both the new full-account export shape (has any of the
        // real data keys) and the old timeData-only export shape (a
        // plain { "2026-01-01": [...] } object with no recognizable
        // keys at all) - so backups made before this change still import.
        const looksLikeFullExport = ['timeData', 'backlogItems', 'categoryGoals', 'customCategoryColors', 'notesData', 'notesNotebooks']
            .some(key => key in imported);

        const ok = await showConfirmDialog(
            looksLikeFullExport
                ? 'Import this backup? It will replace everything currently in your account - calendar, backlog, goals, and all notes.'
                : 'This looks like an older calendar-only backup. Import it? Your calendar will be replaced; notes and backlog stay as they are.',
            { confirmLabel: 'Import', danger: true }
        );
        if (!ok) return;

        if (looksLikeFullExport) {
            timeData = imported.timeData || {};
            backlogItems = imported.backlogItems || [];
            categoryGoals = imported.categoryGoals || {};
            customCategoryColors = imported.customCategoryColors || {};
            notesData = imported.notesData || [];
            notesNotebooks = imported.notesNotebooks || [];
        } else {
            // Old export shape: the whole file WAS timeData.
            timeData = imported;
        }

        localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
        localStorage.setItem('backlogItems', JSON.stringify(backlogItems));
        localStorage.setItem('categoryGoals', JSON.stringify(categoryGoals));
        localStorage.setItem('customCategoryColors', JSON.stringify(customCategoryColors));
        localStorage.setItem('notesData', JSON.stringify(notesData));
        localStorage.setItem('notesNotebooks', JSON.stringify(notesNotebooks));

        currentNoteId = null;
        refreshApp();
        renderNotebookSelector();
        queueCloudSync(true);

        showSaveToast('Backup imported ✓', false);
        setTimeout(() => showSaveToast('', false), 2000);
    };
    reader.readAsText(file);
}

// Builds the same plain-text rendering of a note used by both
// exportCurrentNote() (downloads it as a .txt) and copyCurrentNoteText()
// (copies it straight to the clipboard) - title, notebook, and every
// text block's content in order; photos/voice notes/dividers are noted
// by position since they obviously can't become plain text themselves.
function buildNotePlainText(note) {
    ensureNoteBlocks(note);
    const lines = [note.title || 'Untitled note'];
    if (note.notebook) lines.push(`Notebook: ${note.notebook}`);
    lines.push('');

    note.blocks.forEach(block => {
        if (block.type === 'text') {
            if ((block.content || '').trim()) lines.push(block.content);
        } else if (block.type === 'image') {
            lines.push(`[Photo${block.caption ? ': ' + block.caption : ''}]`);
        } else if (block.type === 'audio') {
            lines.push(`[Voice note - ${formatAudioDuration(block.duration)}]`);
        } else if (block.type === 'divider') {
            lines.push('----------');
        }
    });

    return lines.join('\n\n');
}

// Downloads just the currently-open note as a plain, readable text file -
// use "Export everything" above for a full JSON backup that includes the
// actual media URLs.
function exportCurrentNote() {
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;

    const blob = new Blob([buildNotePlainText(note)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (note.title || 'untitled-note').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'note';
    a.download = `${safeTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Downloads ALL notes (every notebook) as one JSON file - a lighter,
// notes-only export/backup for people who just want their notes
// portable without a full account backup. Reuses the same shape
// importData() already understands (a "notesData"/"notesNotebooks" full
// export, just without the calendar/backlog/goals keys), so this file
// can also be re-imported later via "Import backup" above.
function exportAllNotes() {
    if (!notesData.length) {
        showSaveToast('No notes to export yet', false);
        setTimeout(() => showSaveToast('', false), 1500);
        return;
    }
    const payload = {
        exportedFrom: 'Lodge Time Budgeter (notes only)',
        exportedAt: new Date().toISOString(),
        notesData,
        notesNotebooks
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `notes_backup_${formatDateKey(new Date())}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// --- DROPBOX AUTO-BACKUP ---
// A second, fully independent backup destination alongside the manual
// "Export everything" download - once linked, a snapshot of everything
// (calendar, backlog, goals, notes) gets uploaded to your own Dropbox
// automatically in the background, no action needed each time.
//
// Deliberately independent of Supabase in every sense that matters:
// - The Dropbox refresh token lives ONLY in this browser's localStorage,
//   never inside app_data / buildSyncPayload() - if it were bundled into
//   the same synced blob as everything else, it would (a) get wiped out
//   by the exact kind of Supabase bug that caused a real data loss
//   earlier in this project, taking the backup link down with the data
//   it was meant to protect, and (b) leak your Dropbox access into any
//   "Export everything" JSON file you ever shared with anyone. Neither
//   is acceptable for something whose whole point is to be a safety net.
// - Trade-off: linking is per-browser, not synced across devices. That's
//   the right trade for a backup mechanism.
// - Keeps DATED files (lodge_backup_2026-08-21.json etc.), not just one
//   overwritten "latest" file - so even if a future bug silently backs
//   up bad/empty data once, every earlier day's backup is untouched and
//   still recoverable. A single overwritten "latest" file would have
//   the exact same blind spot the Supabase bug did.
//
// SETUP (one-time, done by whoever owns this Dropbox integration - see
// the DROPBOX_CLIENT_ID placeholder below):
//   1. https://www.dropbox.com/developers/apps -> Create app
//   2. Choose "Scoped access" -> "App folder" (NOT "Full Dropbox" - this
//      sandboxes the app to its own dedicated folder inside the user's
//      Dropbox, so it can never see or touch anything else in their
//      account, regardless of what site/user is granting access)
//   3. Name it anything (e.g. "Lodge Time Budgeter Backups")
//   4. In the app's Settings tab: under "OAuth 2" -> "Redirect URIs",
//      add this site's exact URL (e.g.
//      https://lalogia.pro/index15budgetingapphtml.html)
//   5. Copy the "App key" shown at the top of the Settings tab into
//      DROPBOX_CLIENT_ID below.
const DROPBOX_CLIENT_ID = '4nx0s8pdmsywjfs';
const DROPBOX_REDIRECT_URI = window.location.origin + window.location.pathname;
const DROPBOX_AUTO_BACKUP_MIN_INTERVAL_MS = 15 * 60 * 1000; // at most once per 15 min automatically
let lastDropboxAutoBackupAt = 0;
let dropboxAccessTokenCache = null; // { token, expiresAt }
let pendingFirstDropboxBackup = false; // set true right after linking; acted on once boot has real data loaded (see bootAppWithSession)

function isDropboxConfigured() {
    return DROPBOX_CLIENT_ID && DROPBOX_CLIENT_ID !== 'PASTE_YOUR_DROPBOX_APP_KEY_HERE';
}

function getDropboxRefreshToken() {
    return localStorage.getItem('dropboxRefreshToken');
}

// --- PKCE helpers (no client secret needed - safe to run entirely
// client-side, same reason Supabase's anon key is safe to have in this
// file) ---
function dropboxRandomVerifier() {
    const arr = new Uint8Array(64);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function dropboxChallengeFromVerifier(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Kicks off linking: redirects to Dropbox's own consent screen. Nothing
// happens here except building that URL - the actual token exchange
// happens after Dropbox redirects back (see handleDropboxOAuthRedirect,
// called on every page load).
async function linkDropboxAccount() {
    if (!isDropboxConfigured()) {
        showSaveToast('⚠️ Dropbox isn\'t set up yet - see DROPBOX_CLIENT_ID in the JS file', false);
        setTimeout(() => showSaveToast('', false), 4000);
        return;
    }
    const verifier = dropboxRandomVerifier();
    const challenge = await dropboxChallengeFromVerifier(verifier);
    sessionStorage.setItem('dropboxPkceVerifier', verifier);

    const params = new URLSearchParams({
        client_id: DROPBOX_CLIENT_ID,
        redirect_uri: DROPBOX_REDIRECT_URI,
        response_type: 'code',
        code_challenge: challenge,
        code_challenge_method: 'S256',
        token_access_type: 'offline' // needed to get a refresh_token back, so backups can keep happening without you re-linking every few hours
    });
    window.location.href = `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
}

// Runs on every page load - checks whether we just got redirected back
// from Dropbox's consent screen (a ?code=... in the URL) and, if so,
// exchanges that code for real tokens and stores the refresh token.
async function handleDropboxOAuthRedirect() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;

    // Clean the code out of the URL right away regardless of outcome -
    // it's single-use and shouldn't linger in the address bar/history.
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    const verifier = sessionStorage.getItem('dropboxPkceVerifier');
    sessionStorage.removeItem('dropboxPkceVerifier');
    if (!verifier) return; // redirect from an unrelated/stale link attempt - nothing we can do with it

    try {
        const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                client_id: DROPBOX_CLIENT_ID,
                code_verifier: verifier,
                redirect_uri: DROPBOX_REDIRECT_URI
            })
        });
        const data = await res.json();
        if (!res.ok || !data.refresh_token) throw new Error(data.error_description || data.error || 'No refresh token returned');

        localStorage.setItem('dropboxRefreshToken', data.refresh_token);
        dropboxAccessTokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
        updateDropboxUI();
        showSaveToast('📦 Dropbox linked - backups will happen automatically', false);
        setTimeout(() => showSaveToast('', false), 3000);
        // Don't back up immediately here - this can run before the real
        // Supabase data has finished loading (this whole page just
        // reloaded via the OAuth redirect), which would back up the
        // still-blank starting state as the very first "backup" - the
        // exact same class of bug just fixed for emergencySaveOnExit.
        // bootAppWithSession fires the real first backup once data has
        // actually loaded instead (see pendingFirstDropboxBackup below).
        pendingFirstDropboxBackup = true;
    } catch (err) {
        console.error('Dropbox linking failed:', err);
        showSaveToast('⚠️ Dropbox linking failed - try again', false);
        setTimeout(() => showSaveToast('', false), 3000);
    }
}

// Returns a currently-valid access token, refreshing via the stored
// refresh_token if the cached one is missing/expired. Access tokens are
// short-lived (~4 hours) by design on Dropbox's side; the refresh_token
// itself doesn't expire (unless you unlink from Dropbox's own end).
async function getDropboxAccessToken() {
    if (dropboxAccessTokenCache && dropboxAccessTokenCache.expiresAt > Date.now()) {
        return dropboxAccessTokenCache.token;
    }
    const refreshToken = getDropboxRefreshToken();
    if (!refreshToken) return null;

    const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: DROPBOX_CLIENT_ID
        })
    });
    if (!res.ok) {
        console.error('Dropbox token refresh failed - the link may have been revoked from Dropbox\'s side');
        return null;
    }
    const data = await res.json();
    dropboxAccessTokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
    return data.access_token;
}

async function uploadJsonToDropbox(path, jsonStr, accessToken) {
    const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Dropbox-API-Arg': JSON.stringify({ path, mode: 'overwrite', mute: true }),
            'Content-Type': 'application/octet-stream'
        },
        body: jsonStr
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Dropbox upload failed (${res.status}): ${text.slice(0, 200)}`);
    }
}

// Uploads two files each time: a dated one (a real historical snapshot,
// never overwritten again once that day has passed) and latest.json
// (always current, easy to grab without hunting for the newest date).
// silent=true is used for the automatic background trigger, so routine
// backups don't pop up a toast every 15 minutes.
async function backupNowToDropbox(silent) {
    if (!isDropboxConfigured() || !getDropboxRefreshToken()) return;
    try {
        const token = await getDropboxAccessToken();
        if (!token) {
            if (!silent) {
                showSaveToast('⚠️ Dropbox link expired - please link again', false);
                setTimeout(() => showSaveToast('', false), 3000);
            }
            return;
        }
        const payload = {
            exportedFrom: 'Lodge Time Budgeter (automatic Dropbox backup)',
            exportedAt: new Date().toISOString(),
            ...buildSyncPayload()
        };
        const jsonStr = JSON.stringify(payload, null, 2);
        const dateStr = formatDateKey(new Date());

        await uploadJsonToDropbox(`/lodge_backup_${dateStr}.json`, jsonStr, token);
        await uploadJsonToDropbox('/lodge_backup_latest.json', jsonStr, token);

        lastDropboxAutoBackupAt = Date.now();
        updateDropboxUI();
        if (!silent) {
            showSaveToast('📦 Backed up to Dropbox ✓', false);
            setTimeout(() => showSaveToast('', false), 2000);
        }
    } catch (err) {
        console.error('Dropbox backup failed:', err);
        if (!silent) {
            showSaveToast('⚠️ Dropbox backup failed - check your connection', false);
            setTimeout(() => showSaveToast('', false), 3000);
        }
    }
}

// Called from saveUserData() on every successful Supabase save (see
// below) - rate-limited so a burst of edits doesn't hammer Dropbox's
// API with an upload per keystroke; only fires if enough time has
// passed since the last one.
function maybeAutoBackupToDropbox() {
    if (!getDropboxRefreshToken()) return;
    if (Date.now() - lastDropboxAutoBackupAt < DROPBOX_AUTO_BACKUP_MIN_INTERVAL_MS) return;
    backupNowToDropbox(true);
}

function unlinkDropboxAccount() {
    localStorage.removeItem('dropboxRefreshToken');
    dropboxAccessTokenCache = null;
    updateDropboxUI();
    showSaveToast('Dropbox unlinked', false);
    setTimeout(() => showSaveToast('', false), 2000);
}

function updateDropboxUI() {
    const connected = !!getDropboxRefreshToken();
    const statusText = lastDropboxAutoBackupAt
        ? `Backed up ${new Date(lastDropboxAutoBackupAt).toLocaleTimeString()}`
        : 'Linked';

    // Analytics/Export section controls (full row: link/status/backup now/unlink)
    const linkBtn = document.getElementById('dropbox-link-btn');
    const statusEl = document.getElementById('dropbox-status');
    const backupNowBtn = document.getElementById('dropbox-backup-now-btn');
    const unlinkBtn = document.getElementById('dropbox-unlink-btn');
    if (linkBtn && statusEl && backupNowBtn && unlinkBtn) {
        linkBtn.style.display = connected ? 'none' : 'inline-flex';
        statusEl.style.display = connected ? 'inline' : 'none';
        backupNowBtn.style.display = connected ? 'inline-flex' : 'none';
        unlinkBtn.style.display = connected ? 'inline-flex' : 'none';
        if (connected) {
            statusEl.className = 'dropbox-status connected';
            statusEl.textContent = '📦 ' + statusText;
        }
    }

    // Compact header button (visible from every tab, not just Analytics) -
    // swaps between "Link Dropbox" and a live status pill that doubles as
    // a one-click "back up now" button.
    const headerLinkBtn = document.getElementById('dropbox-header-link-btn');
    const headerStatusBtn = document.getElementById('dropbox-header-status-btn');
    const headerStatusText = document.getElementById('dropbox-header-status-text');
    if (headerLinkBtn && headerStatusBtn && headerStatusText) {
        headerLinkBtn.style.display = connected ? 'none' : 'flex';
        headerStatusBtn.style.display = connected ? 'flex' : 'none';
        if (connected) headerStatusText.textContent = statusText;
    }
    if (typeof updateHeaderActionsScrollHint === 'function') updateHeaderActionsScrollHint();
}

// Runs once on load - if this page load IS the redirect back from
// Dropbox's consent screen, complete the linking. Harmless no-op
// otherwise (no ?code= param present).
handleDropboxOAuthRedirect();



// --- BACKLOG ITEMS (RENDERED AS REAL CALENDAR ACTIVITY BLOCKS) ---
let backlogItems = [];

function saveBacklogItems() {
    pushUndoSnapshot();
    localStorage.setItem('backlogItems', JSON.stringify(backlogItems));
    queueCloudSync();
}

// Toggle Backlog Drawer Visibility (slides open to the right on desktop;
// opens as a full page on phones - see the max-width:768px CSS block).
// Also locks background scroll on phones while it's open, since it's now
// covering the whole screen rather than floating over partially-visible
// content.
function toggleBacklogDrawer(e) {
    if (e) e.stopPropagation();
    const drawer = document.getElementById('backlog-drawer');
    const backdrop = document.getElementById('backlog-drawer-backdrop');
    if (!drawer) return;
    const isOpen = drawer.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open', isOpen);
    document.body.classList.toggle('backlog-drawer-open', isOpen);
}

// Add a new unscheduled item to the backlog
function addBacklogItem() {
    const catInput = document.getElementById('backlog-category');
    const nameInput = document.getElementById('backlog-name');
    const hoursInput = document.getElementById('backlog-hours');

    const category = catInput.value.trim() || 'general';
    const name = nameInput.value.trim();
    const hours = parseFloat(hoursInput.value) || 1;

    backlogItems.push({
        id: 'bl_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        category,
        name,
        hours,
        type: 'actual',
        status: 'todo'
    });

    saveBacklogItems();
    catInput.value = '';
    nameInput.value = '';
    hoursInput.value = 1;
    renderBacklogList();
}

// Same idea as addBacklogItem() above (backlog items and Kanban cards
// are the exact same underlying objects, see the BOARD section further
// down) - just reading from the Kanban section's own fields instead of
// the drawer's, so you can create a card directly from here too, not
// only by dragging an existing backlog item in. Lands in To Do by
// default, same starting point a plain backlog item gets.
function addBoardItem() {
    const catInput = document.getElementById('board-add-category');
    const nameInput = document.getElementById('board-add-name');
    if (!catInput) return;

    const category = catInput.value.trim() || 'general';
    const name = nameInput.value.trim();

    backlogItems.push({
        id: 'bl_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        category,
        name,
        hours: 1, // a task created from Kanban has no duration up front (Kanban is about tasks, not scheduled time) - this is just an internal placeholder used only if/when it's later dragged onto the calendar, and can be resized there like any other block
        type: 'actual',
        status: 'todo'
    });

    saveBacklogItems();
    catInput.value = '';
    nameInput.value = '';
    renderBacklogList(); // also re-renders the Board (see renderBacklogList)
}

function deleteBacklogItem(id) {
    backlogItems = backlogItems.filter(i => i.id !== id);
    if (selectedBacklogId === id) selectedBacklogId = null;
    saveBacklogItems();
    renderBacklogList();
}

// Reorder two backlog items by dragging one on top of the other (drop
// target's index takes the dragged item's place). Replaces the old
// up/down arrow buttons entirely - drag the card itself instead.
function reorderBacklogItem(draggedId, targetId) {
    const fromIdx = backlogItems.findIndex(i => i.id === draggedId);
    const toIdx = backlogItems.findIndex(i => i.id === targetId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;

    const [item] = backlogItems.splice(fromIdx, 1);
    backlogItems.splice(toIdx, 0, item);
    saveBacklogItems();
    renderBacklogList();
}

// Drop a backlog item onto a day column -> becomes a real scheduled block
//
// BUGFIX: this used to call saveBacklogItems() and then saveData()
// separately. Each of those pushes its own undo snapshot, so one drag
// action produced TWO entries on the undo stack instead of one, and the
// second snapshot's "backlogItems" already reflected the post-drag state
// (since saveBacklogItems() had already written it to localStorage).
// Net effect: pressing Ctrl+Z once only half-undid the action - the item
// vanished from the calendar but did not reappear in the backlog until a
// second undo. Fix: take exactly one undo snapshot before either mutation,
// then persist both keys and sync once.
function placeBacklogItemOnCalendar(backlogId, targetDate, startHour, startMinutes) {
    const item = backlogItems.find(i => i.id === backlogId);
    if (!item) return;

    pushUndoSnapshot();

    // Deliberately NOT removed from backlogItems - a backlog/Kanban
    // entry represents a TASK, which can take multiple scheduled
    // sessions across several days to finish. Dragging it onto the
    // calendar creates one such session (a scheduled block) without
    // consuming the task itself; the task only leaves Backlog/Doing/
    // Done when someone drags its card there directly, or deletes it.
    const duration = item.hours || 1;
    const totalStartMins = (startHour * 60) + startMinutes;
    const totalEndMins = Math.min(24 * 60 - 1, totalStartMins + Math.round(duration * 60));

    const newBlock = {
        category: item.category,
        name: item.name,
        hours: duration,
        timeRange: `${String(startHour).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')} to ${String(Math.floor(totalEndMins / 60)).padStart(2, '0')}:${String(totalEndMins % 60).padStart(2, '0')}`,
        type: item.type || 'actual'
    };

    if (!timeData[targetDate]) timeData[targetDate] = [];
    timeData[targetDate].push(newBlock);

    localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
    queueCloudSync();

    refreshApp();
    renderBacklogList();
}

// Drag a scheduled calendar activity into the backlog drawer -> becomes unscheduled again
// BUGFIX: same double-snapshot issue as placeBacklogItemOnCalendar above,
// mirrored in the other direction. Fixed the same way - one snapshot, then
// both keys persisted together.
function sendCalendarBlockToBacklog(sourceDate, index, targetStatus) {
    if (!timeData[sourceDate] || !timeData[sourceDate][index]) return;

    pushUndoSnapshot();

    const [item] = timeData[sourceDate].splice(index, 1);
    if (timeData[sourceDate].length === 0) delete timeData[sourceDate];

    backlogItems.push({
        id: 'bl_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        category: item.category,
        name: item.name,
        hours: item.hours || 1,
        type: item.type || 'actual',
        status: targetStatus || 'todo'
    });

    localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
    localStorage.setItem('backlogItems', JSON.stringify(backlogItems));
    queueCloudSync();

    refreshApp();
    renderBacklogList();
}

// Adjust a backlog item's duration (called when its resize handle is
// dragged) - mirrors resizeTimeBlock() on the big calendar, except there's
// no clock time to update, just the stored hours.
function resizeBacklogItem(id, newHours) {
    const item = backlogItems.find(i => i.id === id);
    if (!item) return;
    item.hours = Math.max(0.25, Math.round(newHours * 100) / 100);
    saveBacklogItems();
    renderBacklogList();
}

// Render the backlog strip as a literal copy of one .matrix-day-col from the
// big calendar: the same 24 dashed hourly background slots, and the same
// absolutely-positioned, drag-to-resize .visual-block cards - just stacked
// back-to-back in list order instead of pinned to a real clock time, and
// with "Backlog" in the header instead of a day name.
function renderBacklogList() {
    const list = document.getElementById('backlog-block-list');
    const badge = document.getElementById('backlog-badge-count');
    // The drawer only ever shows things that might still need scheduling
    // - once a task is moved to Done on the Kanban board, it's finished,
    // so it drops out of this list automatically. It's still fully
    // visible in Kanban's own Done column (that reads status directly,
    // unaffected by this filter) - this only controls what shows up
    // here, next to the calendar.
    const drawerItems = backlogItems.filter(i => (i.status || 'todo') !== 'done');
    if (badge) badge.innerText = drawerItems.length;
    renderBoardSection();
    if (!list) return;

    list.innerHTML = '';

    // 24 hourly background slots, identical look to a calendar day column
    for (let h = 0; h < 24; h++) {
        const slot = document.createElement('div');
        slot.className = 'matrix-slot';
        list.appendChild(slot);
    }

    if (drawerItems.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'backlog-empty-msg';
        empty.innerHTML = 'No backlog items yet.<br>Add one above, drag an activity in, or paste (Ctrl+V) here.';
        list.appendChild(empty);
        list.style.minHeight = `${24 * 40}px`;
        return;
    }

    let cursorTop = 0;

    drawerItems.forEach(item => {
        const color = getCategoryColor(item.category);
        const durationHrs = item.hours || 1;
        const heightPx = Math.max(durationHrs * 40, 18);

        const block = document.createElement('div');
        block.className = `visual-block backlog-block ${item.type || 'actual'}`;
        if (selectedBacklogId === item.id) block.classList.add('selected-block');
        block.style.top = `${cursorTop}px`;
        block.style.height = `${heightPx}px`;
        block.style.backgroundColor = color;
        block.style.cursor = 'grab';
        block.draggable = true;
        block.dataset.backlogId = item.id;

        block.innerHTML = `
            <div class="visual-block-title">${item.type === 'projected' ? '🌫️ ' : ''}${escapeHtml(item.category)}</div>
            ${item.name ? `<div style="font-size:0.65rem; line-height:1.1;">${escapeHtml(item.name)}</div>` : ''}
            <div class="visual-block-time">${item.hours} hr${item.hours == 1 ? '' : 's'}</div>
            <div class="resize-handle"></div>
        `;

        // Single click to select (enables Delete/Supr key and Ctrl+C)
        block.addEventListener('click', (e) => {
            e.stopPropagation();
            setSelectedBacklogItem(item.id);
        });

        // Double click / double tap to open the same edit popup used by
        // calendar activities, so you can retitle, recategorize, change
        // hours, or send it straight to a specific date.
        block.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            openBacklogEditModal(item.id, e);
        });
        addDoubleTapListener(block, (e) => openBacklogEditModal(item.id, e));

        block.addEventListener('dragstart', (e) => {
            draggedBlockInfo = { source: 'backlog', backlogId: item.id, grabOffsetY: 0 };
            block.style.opacity = '0.3';
            e.stopPropagation();
        });

        block.addEventListener('dragend', () => {
            block.style.opacity = item.type === 'projected' ? '0.55' : '1';
            list.querySelectorAll('.backlog-drop-target').forEach(el => el.classList.remove('backlog-drop-target'));
        });

        // Drag-to-reorder: hovering another backlog card while dragging
        // highlights it as the drop target, and releasing over it moves
        // the dragged card to that position in the stack. This is what
        // replaced the old up/down arrow buttons.
        block.addEventListener('dragover', (e) => {
            if (!draggedBlockInfo || draggedBlockInfo.source !== 'backlog' || draggedBlockInfo.backlogId === item.id) return;
            e.preventDefault();
            e.stopPropagation();
            block.classList.add('backlog-drop-target');
        });

        block.addEventListener('dragleave', () => {
            block.classList.remove('backlog-drop-target');
        });

        block.addEventListener('drop', (e) => {
            if (!draggedBlockInfo || draggedBlockInfo.source !== 'backlog' || draggedBlockInfo.backlogId === item.id) return;
            e.preventDefault();
            e.stopPropagation();
            block.classList.remove('backlog-drop-target');
            reorderBacklogItem(draggedBlockInfo.backlogId, item.id);
            draggedBlockInfo = null;
        });

        // Resize handle - drag the bottom edge to grow/shrink it, exactly
        // like activities on the big calendar.
        const handle = block.querySelector('.resize-handle');
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            block.draggable = false;
            const startY = e.clientY;
            const startHeight = heightPx;

            const onMouseMove = (moveEvt) => {
                const deltaY = moveEvt.clientY - startY;
                const rawMins = ((startHeight + deltaY) / 40) * 60;
                const snappedMins = Math.max(15, Math.round(rawMins / 15) * 15);
                block.style.height = `${(snappedMins / 60) * 40}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                block.draggable = true;
                resizeBacklogItem(item.id, parseFloat(block.style.height) / 40);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Delete button, top-right corner of the card. Up/down arrows are
        // gone - drag the card itself onto another card to reorder instead.
        const delBtn = document.createElement('button');
        delBtn.className = 'backlog-block-del';
        delBtn.innerHTML = '✕';
        delBtn.title = 'Delete';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteBacklogItem(item.id);
        };
        block.appendChild(delBtn);

        list.appendChild(block);
        cursorTop += heightPx;
    });

    // Keep the strip tall enough to hold every stacked item (never shorter
    // than a full 24hr calendar column) so nothing overlaps or gets clipped.
    list.style.minHeight = `${Math.max(cursorTop, 24 * 40)}px`;
}

// Wire the drawer itself as a drop target so calendar activities dragged in
// become unscheduled backlog items again.
function initBacklogPanel() {
    const drawer = document.getElementById('backlog-drawer');
    if (drawer) {
        drawer.addEventListener('dragover', (e) => e.preventDefault());
        drawer.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedBlockInfo || draggedBlockInfo.source !== 'calendar') return;
            sendCalendarBlockToBacklog(draggedBlockInfo.sourceDate, draggedBlockInfo.index);
            draggedBlockInfo = null;
        });
    }
    renderBacklogList();
    initBoardSection();
}

// --- BOARD (To Do / Doing / Done) ---
// A second, fuller view of the exact same backlogItems array the drawer
// already uses - a card here and a card in the drawer are the same
// object, just status defaults to 'todo' so an item with no status yet
// (anything created before this existed) shows up in To Do rather than
// vanishing. The drawer stays as the quick, narrow "things I haven't
// scheduled" list; this is the fuller three-column view of the same
// data, its own top-level section since three real columns need more
// room than a sidebar drawer can give them.
//
// Deliberately reuses draggedBlockInfo (the same variable the drawer and
// calendar already share) rather than inventing a separate drag system -
// a card dragged out of a Board column already lands correctly on the
// calendar for free, since the calendar's day-column drop handler only
// ever looks up backlogItems by id, not which UI the drag started in.
const BOARD_DOING_WIP_LIMIT = 3;
const BOARD_COLUMNS = [
    { status: 'todo', label: '📥 To Do' },
    { status: 'doing', label: '🔨 Doing' },
    { status: 'done', label: '✅ Done' }
];

function boardItemsByStatus(status) {
    // Anything without a status at all (every item that existed before
    // Board did) is treated as 'todo' - so upgrading to this feature
    // never makes existing backlog items disappear from view.
    return backlogItems.filter(i => (i.status || 'todo') === status);
}

function initBoardSection() {
    BOARD_COLUMNS.forEach(col => {
        const el = document.getElementById(`board-col-${col.status}`);
        if (!el) return;
        el.addEventListener('dragover', (e) => e.preventDefault());
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedBlockInfo) return;
            if (draggedBlockInfo.source === 'calendar') {
                // A calendar activity dragged straight into a Board
                // column - becomes a backlog item AND lands directly in
                // that column in one motion, rather than always having
                // to go through To Do first.
                if (col.status === 'doing' && boardItemsByStatus('doing').length >= BOARD_DOING_WIP_LIMIT) {
                    showSaveToast(`Doing is full (${BOARD_DOING_WIP_LIMIT}/${BOARD_DOING_WIP_LIMIT}) - finish or move something first`, false);
                    setTimeout(() => showSaveToast('', false), 2500);
                    draggedBlockInfo = null;
                    return;
                }
                sendCalendarBlockToBacklog(draggedBlockInfo.sourceDate, draggedBlockInfo.index, col.status);
                draggedBlockInfo = null;
                return;
            }
            if (draggedBlockInfo.source === 'backlog') {
                moveBoardItem(draggedBlockInfo.backlogId, col.status, null);
                draggedBlockInfo = null;
            }
        });

        // Completes an armed touch-move (see toggleArmedMoveBoardCard) -
        // a tap anywhere in this column while a card is armed moves it
        // here. Does nothing when nothing's armed, so it's inert during
        // normal scrolling/tapping.
        el.addEventListener('touchend', (e) => {
            if (!armedMoveBoardCardId) return;
            if (e.target.closest('.board-card')) return; // let the card's own dblclick-arm/buttons handle taps directly on a card
            e.preventDefault();
            const movingId = armedMoveBoardCardId;
            armedMoveBoardCardId = null;
            if (navigator.vibrate) navigator.vibrate(30);
            moveBoardItem(movingId, col.status, null);
        });
    });
    renderBoardSection();
}

// Moves a card to (or within) a column: pulls it out of its current
// position, sets its status, and re-inserts either at the end of the
// column (beforeId is null - dropped on empty column space) or right
// before a specific card (beforeId set - dropped on top of another
// card, for precise reordering). Enforces the Doing WIP limit here so
// every path that can move a card into Doing (drawer drag, calendar
// drag, board-to-board drag) goes through the same check.
function moveBoardItem(draggedId, newStatus, beforeId) {
    const idx = backlogItems.findIndex(i => i.id === draggedId);
    if (idx === -1) return;
    const item = backlogItems[idx];
    const currentStatus = item.status || 'todo';

    if (newStatus === 'doing' && currentStatus !== 'doing') {
        const doingCount = boardItemsByStatus('doing').length;
        if (doingCount >= BOARD_DOING_WIP_LIMIT) {
            showSaveToast(`Doing is full (${BOARD_DOING_WIP_LIMIT}/${BOARD_DOING_WIP_LIMIT}) - finish or move something first`, false);
            setTimeout(() => showSaveToast('', false), 2500);
            return;
        }
    }

    pushUndoSnapshot();
    backlogItems.splice(idx, 1);
    item.status = newStatus;

    if (beforeId) {
        const targetIdx = backlogItems.findIndex(i => i.id === beforeId);
        backlogItems.splice(targetIdx === -1 ? backlogItems.length : targetIdx, 0, item);
    } else {
        backlogItems.push(item);
    }

    localStorage.setItem('backlogItems', JSON.stringify(backlogItems));
    queueCloudSync();
    renderBacklogList(); // also re-renders the Board (see renderBacklogList)
}

function renderBoardSection() {
    BOARD_COLUMNS.forEach(col => {
        const listEl = document.getElementById(`board-col-${col.status}`);
        const countEl = document.getElementById(`board-count-${col.status}`);
        if (!listEl) return;

        const items = boardItemsByStatus(col.status);
        if (countEl) {
            countEl.textContent = col.status === 'doing' ? `${items.length}/${BOARD_DOING_WIP_LIMIT}` : items.length;
            countEl.classList.toggle('board-count-full', col.status === 'doing' && items.length >= BOARD_DOING_WIP_LIMIT);
        }

        listEl.innerHTML = '';
        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'board-empty-msg';
            empty.textContent = col.status === 'todo' ? t('kanban.emptyTodo') : t('kanban.emptyOther');
            listEl.appendChild(empty);
            return;
        }
        items.forEach(item => listEl.appendChild(buildBoardCardEl(item, col.status)));
    });
}

function buildBoardCardEl(item, status) {
    const color = getCategoryColor(item.category);
    const card = document.createElement('div');
    card.className = `board-card ${status === 'done' ? 'board-card-done' : ''}`;
    if (armedMoveBoardCardId === item.id) card.classList.add('board-card-move-armed');
    card.draggable = true;
    card.dataset.backlogId = item.id;
    card.style.borderLeftColor = color;

    card.innerHTML = `
        <div class="board-card-top">
            <span class="board-card-category" style="color:${color};">${item.type === 'projected' ? '🌫️ ' : ''}${escapeHtml(item.category)}</span>
            <div class="board-card-top-actions">
                <button type="button" class="board-card-edit" title="Edit">✎</button>
                <button type="button" class="board-card-del" title="Delete">✕</button>
            </div>
        </div>
        ${item.name ? `<div class="board-card-name">${escapeHtml(item.name)}</div>` : ''}
    `;

    card.querySelector('.board-card-del').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteBacklogItem(item.id);
    });
    card.querySelector('.board-card-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        openBacklogEditModal(item.id, e);
    });

    // Desktop mouse: dblclick still opens the editor directly, same as
    // it always has. Touch: double-tap now arms the card for a two-tap
    // move instead (see toggleArmedMoveBoardCard) - editing on touch
    // goes through the explicit ✎ button above instead, the same
    // tradeoff already made for calendar blocks.
    card.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        openBacklogEditModal(item.id, e);
    });
    addDoubleTapListener(card, () => toggleArmedMoveBoardCard(item.id));

    // Same dragstart shape the drawer already uses (source:'backlog',
    // backlogId) - this is exactly what makes dragging a card straight
    // onto the calendar work without any extra code: the day-column
    // drop handler already knows what to do with it.
    card.addEventListener('dragstart', (e) => {
        draggedBlockInfo = { source: 'backlog', backlogId: item.id, grabOffsetY: 0 };
        card.style.opacity = '0.4';
        e.stopPropagation();
    });
    card.addEventListener('dragend', () => {
        card.style.opacity = '1';
        document.querySelectorAll('.board-card-drop-target').forEach(el => el.classList.remove('board-card-drop-target'));
    });

    // Dropping directly on top of another card reorders precisely
    // (inserts before it) instead of just landing at the end of
    // whichever column it's dropped into.
    card.addEventListener('dragover', (e) => {
        if (!draggedBlockInfo || draggedBlockInfo.source !== 'backlog' || draggedBlockInfo.backlogId === item.id) return;
        e.preventDefault();
        e.stopPropagation();
        card.classList.add('board-card-drop-target');
    });
    card.addEventListener('dragleave', () => card.classList.remove('board-card-drop-target'));
    card.addEventListener('drop', (e) => {
        if (!draggedBlockInfo || draggedBlockInfo.source !== 'backlog' || draggedBlockInfo.backlogId === item.id) return;
        e.preventDefault();
        e.stopPropagation();
        card.classList.remove('board-card-drop-target');
        moveBoardItem(draggedBlockInfo.backlogId, status, item.id);
        draggedBlockInfo = null;
    });

    return card;
}


// --- NOTES ---
// Two-pane layout, not a popup: a vertical list of notes on the left
// (small title + preview, like the sidebar of a real notes app) and one
// big always-visible editing pane on the right that shows whichever note
// is selected. No modal to open/close, and no "Add"/"Save" button in the
// editor - you just type and it's kept (autosaved), and if you delete
// text it stays deleted. Colored the same way as the calendar/backlog
// when a category is set (getCategoryColor), so "math" is the same blue
// everywhere in the app; uncategorized notes fall back to --text (white
// in dark mode, black in light mode).
let notesData = [];
let currentNoteId = null;
let noteSaveDebounceTimer = null;

// Notebooks group notes (e.g. "Coding", "Journal") - purely a label stored
// on each note (note.notebook). The list of notebook names that have ever
// been created is kept separately so an empty notebook still shows up in
// the picker even before any note is filed into it.
let notesNotebooks = [];
let activeNotebookFilter = '';
let notesSearchQuery = '';
// 'custom' keeps whatever order notes sit in notesData (drag to
// reorder them there); 'alpha' sorts the visible list by title without
// touching that underlying order, so switching back to "My order"
// always restores exactly how they were arranged.
let notesSortMode = localStorage.getItem('notesSortMode') || 'custom';
let draggedNoteId = null;

// Notes don't participate in the calendar/backlog undo stack (same as
// categoryGoals and customCategoryColors below) - they're edited through
// an explicit form with their own explicit Delete button, not something
// you can nudge or drag by accident the way calendar blocks can.
function saveNotesData() {
    try {
        localStorage.setItem('notesData', JSON.stringify(notesData));
    } catch (err) {
        // Mobile browsers give localStorage a much smaller quota than
        // desktop, and voice notes/photos are stored as base64 right
        // inside this JSON - so a phone can silently run out of room in
        // a way desktop never hits. Without this catch, the exception
        // used to escape scheduleNoteSave's setTimeout and quietly kill
        // the save (and the "Saved" indicator, and the sidebar refresh)
        // with zero feedback - which is exactly what looked like
        // "recording doesn't work on the phone".
        console.error('Could not save notes locally (storage may be full):', err);
        setVoiceStatus('⚠️ Storage is full - this change may not be saved. Try deleting an old voice note or photo.');
        return;
    }
    queueCloudSync();
}

// --- NOTES UNDO ---
// A separate, lightweight undo stack just for notes (deleting a block, a
// whole note, or plain text you typed/deleted in a block), so there's a
// way to walk that back on a phone where there's no Ctrl+Z key to press -
// the ↺ button in the toolbar calls this. A snapshot is taken on block
// delete, note delete, and on focusing into a text block (see
// buildTextBlockEl) rather than on every keystroke. Kept small (a handful
// of steps) since a snapshot is the full notesData including any embedded
// photo/voice base64, which can get big fast.
let notesUndoStack = [];
let notesRedoStack = [];
const MAX_NOTES_UNDO_STEPS = 8;

function pushNotesUndoSnapshot() {
    notesUndoStack.push(JSON.stringify(notesData));
    if (notesUndoStack.length > MAX_NOTES_UNDO_STEPS) notesUndoStack.shift();
    // Standard undo/redo semantics: making a genuinely new change
    // invalidates whatever redo history existed (you can't "redo"
    // forward into a future that no longer exists once you've branched
    // off with a new edit).
    notesRedoStack = [];
    updateNotesUndoBtn();
}

function undoNoteAction() {
    if (notesUndoStack.length === 0) return;
    stopNoteRecordingIfActive();
    // Save where we are now onto redo before stepping back, so
    // redoNoteAction() can bring it back.
    notesRedoStack.push(JSON.stringify(notesData));
    if (notesRedoStack.length > MAX_NOTES_UNDO_STEPS) notesRedoStack.shift();

    const prevSnapshot = notesUndoStack.pop();
    notesData = JSON.parse(prevSnapshot);
    saveNotesData();
    applyUndoRedoResult();
}

function redoNoteAction() {
    if (notesRedoStack.length === 0) return;
    stopNoteRecordingIfActive();
    // Save where we are now back onto undo, so undo still works
    // normally after a redo.
    notesUndoStack.push(JSON.stringify(notesData));
    if (notesUndoStack.length > MAX_NOTES_UNDO_STEPS) notesUndoStack.shift();

    const nextSnapshot = notesRedoStack.pop();
    notesData = JSON.parse(nextSnapshot);
    saveNotesData();
    applyUndoRedoResult();
}

// Shared by undo and redo: re-selects/closes the open note based on
// whether it still exists in the restored snapshot, and refreshes the
// undo/redo button states.
function applyUndoRedoResult() {
    const stillOpenNote = notesData.find(n => n.id === currentNoteId);
    if (stillOpenNote) {
        selectNote(currentNoteId);
    } else {
        currentNoteId = null;
        const emptyState = document.getElementById('notes-empty-state');
        const editor = document.getElementById('notes-editor');
        if (editor) editor.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        applyNotePageColor(null);
        setMobileNotesView('list');
    }
    renderNotesList();
    updateNotesUndoBtn();
}

function updateNotesUndoBtn() {
    const undoBtn = document.getElementById('notes-undo-btn');
    if (undoBtn) undoBtn.disabled = notesUndoStack.length === 0;
    const redoBtn = document.getElementById('notes-redo-btn');
    if (redoBtn) redoBtn.disabled = notesRedoStack.length === 0;
}

// Returns the left-border/category-chip color for a note: the shared
// category color if one's set, otherwise the theme's text color so
// uncategorized notes read as white (dark mode) or black (light mode).
function getNoteColor(category) {
    const trimmed = (category || '').trim();
    if (!trimmed) return 'var(--text)';
    return getCategoryColor(trimmed);
}

// --- NOTE PAGE COLOR ---
// A separate, optional per-note "page color" (note.color) - lets a note's
// full editing page (and its mini preview row in the sidebar) be recolored,
// independent of the category-color system above. Includes white, since
// the category palette doesn't have it and a plain white page is a very
// normal thing to want for a notes app.
const notePageColorPalette = ['#ffffff', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#1e293b'];

// Picks readable text (near-black or near-white) for a given page color,
// so white/light pages get dark text and dark pages get light text.
function getReadableTextColor(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#1a1a1a' : '#f5f5f5';
}

// Applies (or clears) a note's custom page color to the big editor pane -
// sets both the background and a matching readable text color, or removes
// both so the pane falls back to the normal theme colors.
function applyNotePageColor(note) {
    const pane = document.getElementById('notes-editor-pane') || document.querySelector('.notes-editor-pane');
    if (!pane) return;
    if (note && note.color) {
        pane.style.setProperty('--note-bg', note.color);
        pane.style.setProperty('--note-text', getReadableTextColor(note.color));
    } else {
        pane.style.removeProperty('--note-bg');
        pane.style.removeProperty('--note-text');
    }
}

function renderNoteColorSwatches() {
    const wrap = document.getElementById('notes-color-swatches');
    if (!wrap) return;
    const note = notesData.find(n => n.id === currentNoteId);
    wrap.innerHTML = '';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'notes-color-swatch notes-color-reset';
    resetBtn.title = 'Use theme color';
    if (note && !note.color) resetBtn.classList.add('active');
    resetBtn.addEventListener('click', () => setNoteColor(null));
    wrap.appendChild(resetBtn);

    notePageColorPalette.forEach(hex => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'notes-color-swatch';
        btn.style.background = hex;
        btn.title = hex;
        if (note && note.color === hex) btn.classList.add('active');
        btn.addEventListener('click', () => setNoteColor(hex));
        wrap.appendChild(btn);
    });

    // The trigger button shows the note's actual chosen color as a
    // solid dot, or falls back to the CSS rainbow default (see
    // .notes-color-trigger-dot) when it's using the theme color.
    const dot = document.getElementById('notes-color-trigger-dot');
    if (dot) dot.style.background = (note && note.color) ? note.color : '';
}

function toggleNoteColorPicker() {
    const panel = document.getElementById('notes-color-picker-panel');
    const trigger = document.getElementById('notes-color-trigger');
    if (!panel) return;
    const opening = !panel.classList.contains('open');
    panel.classList.toggle('open', opening);
    if (trigger) trigger.classList.toggle('open', opening);
}

function closeNoteColorPicker() {
    document.getElementById('notes-color-picker-panel')?.classList.remove('open');
    document.getElementById('notes-color-trigger')?.classList.remove('open');
}

function setNoteColor(hex) {
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    note.color = hex || null;
    note.updatedAt = Date.now();
    saveNotesData();
    applyNotePageColor(note);
    renderNoteColorSwatches();
    renderNotesList();
    closeNoteColorPicker();
}

document.addEventListener('click', (e) => {
    const wrap = document.getElementById('notes-color-picker-wrap');
    const panel = document.getElementById('notes-color-picker-panel');
    if (!wrap || !panel || !panel.classList.contains('open')) return;
    if (!wrap.contains(e.target)) closeNoteColorPicker();
});

// --- "MORE OPTIONS" MENU (Delete / Download / Copy / Duplicate) ---
function toggleNoteActionsMenu() {
    const panel = document.getElementById('note-actions-menu-panel');
    const trigger = document.getElementById('note-actions-menu-btn');
    if (!panel) return;
    const opening = !panel.classList.contains('open');
    panel.classList.toggle('open', opening);
    if (trigger) trigger.classList.toggle('open', opening);
}

function closeNoteActionsMenu() {
    document.getElementById('note-actions-menu-panel')?.classList.remove('open');
    document.getElementById('note-actions-menu-btn')?.classList.remove('open');
}

document.addEventListener('click', (e) => {
    const wrap = document.getElementById('note-actions-menu-wrap');
    const panel = document.getElementById('note-actions-menu-panel');
    if (!wrap || !panel || !panel.classList.contains('open')) return;
    if (!wrap.contains(e.target)) closeNoteActionsMenu();
});

// Copies the note's plain-text rendering (same one exportCurrentNote
// downloads as a .txt) straight to the clipboard instead - a quick way
// to paste a note's contents somewhere else without a file changing
// hands.
async function copyCurrentNoteText() {
    const note = notesData.find(n => n.id === currentNoteId);
    closeNoteActionsMenu();
    if (!note) return;
    try {
        await navigator.clipboard.writeText(buildNotePlainText(note));
        setVoiceStatus('Note copied.');
        setTimeout(() => setVoiceStatus(''), 1500);
    } catch (err) {
        setVoiceStatus("Couldn't copy that note.");
        setTimeout(() => setVoiceStatus(''), 2000);
    }
}

// Creates an identical copy of the current note (fresh id, fresh block
// ids so editing one never touches the other) right above it in the
// list, and opens the copy.
function duplicateCurrentNote() {
    const note = notesData.find(n => n.id === currentNoteId);
    closeNoteActionsMenu();
    if (!note) return;

    const copy = JSON.parse(JSON.stringify(note));
    copy.id = 'note_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    copy.title = note.title ? `${note.title} (copy)` : '';
    copy.createdAt = Date.now();
    copy.updatedAt = Date.now();
    if (Array.isArray(copy.blocks)) {
        copy.blocks.forEach(b => { b.id = genBlockId(); });
    }

    notesData.unshift(copy);
    saveNotesData();
    selectNote(copy.id);
}

// --- VOICE NOTES (inline blocks) ---
// A note's content is an ordered array of blocks - some plain text,
// some voice recordings - so you can record anywhere in the note and
// keep typing before/after it: text, then a voice note, then more
// text, in any order, each one movable and deletable on its own.
// Recording uses MediaRecorder and stores the clip as a base64 data
// URL right inside the block, so it rides along in the same
// localStorage/cloud sync as everything else - no separate file
// storage needed.
let lastFocusedBlockId = null;

// Mobile-only: which "screen" the Notes tab is showing - the full list,
// or the full open note - never both at once (see the CSS rules under
// #notes-section.mobile-view-list / .mobile-view-detail). Harmless on
// desktop/tablet: those CSS rules only exist inside the phone-width
// media query, so toggling this class has no visual effect there.
let mobileNotesView = 'list';

function setMobileNotesView(view) {
    mobileNotesView = view;
    const section = document.getElementById('notes-section');
    if (!section) return;
    section.classList.toggle('mobile-view-list', view === 'list');
    section.classList.toggle('mobile-view-detail', view === 'detail');
}

// Wired to the "←" back button that only shows on phone widths.
function showMobileNotesList() {
    stopNoteRecordingIfActive();
    setMobileNotesView('list');
}

// --- MOBILE NOTES TOOLBAR: pinned above the on-screen keyboard ---
// On phones, the color/photo/record toolbar is fixed-positioned (see
// the max-width:768px CSS). By default that just means it floats
// right above the bottom tab bar - but the real goal is for it to act
// like a native app's keyboard accessory view: stay glued to the top
// edge of the keyboard itself while you're typing. Mobile browsers
// don't move the layout viewport when the keyboard opens, they shrink
// the *visual* viewport, so window.visualViewport is what actually
// reports the keyboard's height - a plain 'resize' on window won't
// fire the same way here.
function positionNotesToolbar() {
    const toolbar = document.getElementById('notes-toolbar');
    if (!toolbar) return;

    // This whole scheme is phone-only; on wider screens the toolbar is
    // a normal in-flow row and should never get an inline `bottom`.
    if (window.innerWidth > 768 || !window.visualViewport) {
        toolbar.style.bottom = '';
        document.body.classList.remove('keyboard-open');
        return;
    }

    const vv = window.visualViewport;
    const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    const keyboardOpen = keyboardHeight > 60; // small fudge factor - ignores toolbar chrome/rounding, not a real keyboard

    document.body.classList.toggle('keyboard-open', keyboardOpen);
    toolbar.style.bottom = keyboardOpen ? keyboardHeight + 'px' : '';
}

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', positionNotesToolbar);
    window.visualViewport.addEventListener('scroll', positionNotesToolbar);
}
// Belt-and-suspenders: focus/blur on anything inside the note also
// repositions the toolbar. Some mobile browsers fire the keyboard's
// visualViewport resize a beat after focus, so this alone can be a
// touch early - but the resize listener above catches the real,
// final height right after.
document.addEventListener('focusin', (e) => {
    if (e.target.closest && e.target.closest('#notes-editor')) {
        setTimeout(positionNotesToolbar, 50);
    }
});
document.addEventListener('focusout', (e) => {
    if (e.target.closest && e.target.closest('#notes-editor')) {
        setTimeout(positionNotesToolbar, 50);
    }
});


let noteMediaRecorder = null;
let noteRecordingChunks = [];
// Kept alive and REUSED across multiple recordings in the same session
// instead of being requested fresh every time - see startNoteRecording
// and releaseNoteRecordingStreamForGood below for why: re-calling
// getUserMedia() for every single recording is what was causing the
// permission prompt to reappear over and over on some phones, even
// though the site already had permission. Only released when you
// actually leave Notes (or the page unloads) via
// releaseNoteRecordingStreamForGood.
let noteRecordingStream = null;
let noteRecordingStartTime = null;
let noteRecordingTimerInterval = null;
// True only for the brief window between tapping the record button and
// getUserMedia() actually resolving - guards against a second tap in
// that window starting a second, orphaned stream (which was producing
// occasional corrupt/silent recordings on phones, since the SECOND
// stream's recorder would overwrite noteMediaRecorder while the FIRST
// one's mic was still open and unused).
let noteRecordingIsStarting = false;
// Snapshot of the recording's duration, taken the instant stop() is
// requested - see stopNoteRecordingIfActive for why this can't just be
// recalculated from noteRecordingStartTime later on.
let pendingRecordingDurationSec = 0;

function genBlockId() {
    return 'blk_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

// Migrates whatever shape an older note was saved in - a single `body`
// string, a separate `voiceNotes` array, or both - into one ordered
// `blocks` array (text content first, then any old clips tacked on the
// end), and guarantees there's always at least one block to type into.
function ensureNoteBlocks(note) {
    // One-time migration: the notes "category" field used to point at
    // the calendar's own activity categories (shared datalist, shared
    // color-coding) - which never made sense for a note, so it's now a
    // notebook picker instead (note.notebook). Existing notes that
    // already had a category set get it carried over into notebook
    // (only if they don't already have one) instead of silently losing
    // that organization, and the value is registered as a real notebook
    // so it shows up in the sidebar filter too.
    if (note.category && !note.notebook) {
        note.notebook = note.category;
        if (!notesNotebooks.includes(note.notebook)) {
            notesNotebooks.push(note.notebook);
        }
    }

    if (!note.blocks || !Array.isArray(note.blocks) || note.blocks.length === 0) {
        const blocks = [];
        if (note.body) blocks.push({ id: genBlockId(), type: 'text', content: note.body });
        if (note.voiceNotes && note.voiceNotes.length) {
            note.voiceNotes.forEach(clip => {
                blocks.push({ id: genBlockId(), type: 'audio', audioData: clip.dataUrl, duration: clip.duration, label: 'Voice note', createdAt: clip.createdAt });
            });
        }
        if (blocks.length === 0) blocks.push({ id: genBlockId(), type: 'text', content: '' });
        note.blocks = blocks;
    }
    return note.blocks;
}

// Plain-text preview for the sidebar list: joins the text blocks and
// ignores audio blocks (their count shows separately as a badge).
function getNotePreviewText(note) {
    ensureNoteBlocks(note);
    return note.blocks.filter(b => b.type === 'text').map(b => b.content || '').join(' ').trim();
}

function getNoteVoiceCount(note) {
    ensureNoteBlocks(note);
    return note.blocks.filter(b => b.type === 'audio').length;
}

function getNoteImageCount(note) {
    ensureNoteBlocks(note);
    return note.blocks.filter(b => b.type === 'image').length;
}

function formatAudioDuration(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function setVoiceStatus(text) {
    const status = document.getElementById('notes-voice-status');
    if (status) status.innerText = text || '';
}

function updateVoiceRecordButtonUI(isRecording) {
    const btn = document.getElementById('notes-voice-record-btn');
    if (!btn) return;
    btn.classList.toggle('recording', isRecording);
    btn.innerHTML = isRecording ? '⏹' : '●';
    btn.title = isRecording ? 'Stop recording' : 'Record a voice note here';
}

function toggleNoteRecording() {
    if (noteMediaRecorder && noteMediaRecorder.state === 'recording') {
        stopNoteRecordingIfActive();
    } else {
        startNoteRecording();
    }
}

async function startNoteRecording() {
    if (!currentNoteId) return;
    if (noteRecordingIsStarting) return; // already mid-request from a previous tap - don't spawn a second stream
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
        setVoiceStatus("This browser can't record audio here - try a different browser, or make sure the page is loaded over https.");
        return;
    }
    // getUserMedia is only available in a secure context (https, or
    // localhost). On a phone opening the page over plain http, the
    // check above silently fails in a way that looks identical to "no
    // mic support" - calling it out specifically saves a lot of
    // confused debugging.
    if (window.isSecureContext === false) {
        setVoiceStatus("Voice recording needs a secure (https) connection - open this page over https to record.");
        return;
    }

    // Reuse an already-open mic stream from an earlier recording this
    // session, if its tracks are all still live - this is the actual
    // fix for the permission prompt reappearing on every single
    // recording: each fresh getUserMedia() call is a brand new
    // permission request as far as several mobile browsers are
    // concerned, even when the site already has permission. Only ask
    // again when there's genuinely no usable stream left (first
    // recording ever, or the mic was revoked/disconnected since).
    let stream = (noteRecordingStream && noteRecordingStream.getAudioTracks().every(tr => tr.readyState === 'live'))
        ? noteRecordingStream
        : null;

    if (!stream) {
        noteRecordingIsStarting = true;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    // Opus (what MediaRecorder encodes to in Chrome/Edge) is
                    // natively 48kHz. Some laptop/webcam mics default to
                    // 44.1kHz or something odd, and letting that mismatch
                    // slide is what causes the classic "chipmunk" sped-up
                    // playback bug - so we ask for 48kHz explicitly instead
                    // of trusting the device's own rate.
                    sampleRate: { ideal: 48000 },
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
        } catch (err) {
            // A number of phones (older Android WebViews especially) throw
            // an OverconstrainedError on the detailed request above even
            // though the mic itself is perfectly usable - so retry once
            // with the plainest possible request before giving up.
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (err2) {
                noteRecordingIsStarting = false;
                setVoiceStatus("Couldn't access the microphone - check that this site has mic permission.");
                return;
            }
        }
        noteRecordingIsStarting = false;
        noteRecordingStream = stream;
    }

    try {
        noteRecordingChunks = [];

        // Pin down an explicit, known-good mimeType instead of letting
        // the browser guess - keeps the encoder consistent with the
        // 48kHz we requested above. iOS/iPadOS Safari never supports
        // webm at all, only audio/mp4 - that's still covered here.
        const preferredMimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4;codecs=mp4a.40.2', 'audio/mp4']
            .find(t => typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(t));

        const recorderOptions = preferredMimeType ? { mimeType: preferredMimeType } : {};
        // Voice notes don't need music-quality bitrate, and keeping the
        // encoded size down matters a lot more on mobile - localStorage
        // quotas there are typically a fraction of desktop, and this is
        // stored as base64 (roughly +33% size) right inside the notes
        // JSON, so oversized clips are the single biggest cause of
        // saves silently failing on a phone.
        recorderOptions.audioBitsPerSecond = 64000;

        try {
            noteMediaRecorder = new MediaRecorder(stream, recorderOptions);
        } catch (e) {
            // Some mobile browsers reject option combos they'd otherwise
            // accept individually - fall back to letting the browser
            // pick everything itself rather than failing to record.
            noteMediaRecorder = new MediaRecorder(stream);
        }

        noteMediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) noteRecordingChunks.push(e.data);
        };
        noteMediaRecorder.onstop = handleNoteRecordingStop;
        noteMediaRecorder.onerror = () => {
            setVoiceStatus("Recording stopped unexpectedly - try again.");
            stopNoteRecordingIfActive();
        };

        // A timeslice makes the recorder flush chunks periodically
        // instead of only at stop(). That's safe (and needed) for
        // WebM/Opus, which is a segmented container designed to be
        // concatenated chunk by chunk - it's what keeps mobile
        // Chrome/Android reliably producing audio at all. Safari's
        // audio/mp4, however, emits fragmented-MP4 chunks that don't
        // always splice back together correctly when just concatenated
        // - this is exactly what was causing clips to report the right
        // duration and a non-empty file, yet play back silent past the
        // first second or so. So mp4 recordings ask for one single
        // chunk at the end instead, which always decodes correctly.
        const isFragmentedMp4 = !!(preferredMimeType && preferredMimeType.indexOf('mp4') !== -1);
        if (isFragmentedMp4) {
            noteMediaRecorder.start();
        } else {
            noteMediaRecorder.start(1000);
        }
        noteRecordingStartTime = Date.now();
        updateVoiceRecordButtonUI(true);
        noteRecordingTimerInterval = setInterval(updateNoteRecordingTimerLabel, 250);
        updateNoteRecordingTimerLabel();
    } catch (err) {
        setVoiceStatus("Couldn't start recording - try again.");
        releaseNoteRecordingStreamForGood();
    }
}

// Stops the recorder (if one's running) and releases the mic. Safe to
// call any time - switching notes, deleting the current note, or
// closing the tab mid-recording all route through here.
//
// Two bugs used to live here, both mobile-specific:
// 1. noteRecordingStartTime was nulled out synchronously, right here -
//    but onstop (which computes the clip's duration) fires
//    asynchronously, AFTER this function has already returned. By the
//    time it ran, the start time was already gone, so every saved
//    recording's duration came out as exactly 0 - which is exactly
//    what was reported ("counter counts the seconds, but after I
//    record it says 0"). The duration is now captured here, before
//    it's cleared, and handed to handleNoteRecordingStop directly.
// 2. The mic tracks were killed immediately after calling .stop(),
//    without waiting for the recorder to actually finish flushing its
//    last chunk of audio. Desktop browsers are forgiving about this;
//    several mobile browsers are not, and cutting the tracks that
//    early can silently drop the tail of the recording - producing a
//    clip that "recorded" (the timer ran) but plays back as silence
//    or doesn't play at all. Tracks are now released inside
//    handleNoteRecordingStop instead, once onstop has actually fired.
function stopNoteRecordingIfActive() {
    if (noteMediaRecorder && noteMediaRecorder.state === 'recording') {
        pendingRecordingDurationSec = noteRecordingStartTime ? (Date.now() - noteRecordingStartTime) / 1000 : 0;
        noteMediaRecorder.stop();
    }
    if (noteRecordingTimerInterval) {
        clearInterval(noteRecordingTimerInterval);
        noteRecordingTimerInterval = null;
    }
    noteRecordingStartTime = null;
    updateVoiceRecordButtonUI(false);
}

// The mic itself is kept open for a little while after a recording
// ends (see handleNoteRecordingStop) so recording a second or third
// voice note right after doesn't ask for permission all over again.
// This is what actually turns that "keep it open" grace period back
// off - stopping the tracks for real and clearing the idle timer that
// would otherwise do it automatically a little later.
let noteRecordingIdleReleaseTimer = null;
function releaseNoteRecordingStreamForGood() {
    if (noteRecordingIdleReleaseTimer) {
        clearTimeout(noteRecordingIdleReleaseTimer);
        noteRecordingIdleReleaseTimer = null;
    }
    if (noteRecordingStream) {
        noteRecordingStream.getTracks().forEach(t => t.stop());
        noteRecordingStream = null;
    }
}

function updateNoteRecordingTimerLabel() {
    if (!noteRecordingStartTime) return;
    const secs = Math.floor((Date.now() - noteRecordingStartTime) / 1000);
    setVoiceStatus(`Recording… ${formatAudioDuration(secs)}`);
}

async function handleNoteRecordingStop() {
    const mimeType = (noteMediaRecorder && noteMediaRecorder.mimeType) || 'audio/webm';
    const blob = new Blob(noteRecordingChunks, { type: mimeType });
    noteRecordingChunks = [];
    const durationSec = pendingRecordingDurationSec;
    pendingRecordingDurationSec = 0;
    noteMediaRecorder = null;

    // Leave the mic open for a minute in case another voice note gets
    // recorded right after this one - releaseNoteRecordingStreamForGood
    // cancels this and shuts it down properly the moment you actually
    // leave Notes (see setMobileSection/showMobileNotesList) or close
    // the tab, so it's never left running indefinitely.
    if (noteRecordingIdleReleaseTimer) clearTimeout(noteRecordingIdleReleaseTimer);
    noteRecordingIdleReleaseTimer = setTimeout(releaseNoteRecordingStreamForGood, 60000);

    const note = notesData.find(n => n.id === currentNoteId);
    if (!note || blob.size === 0) {
        setVoiceStatus(blob && blob.size === 0 ? "Didn't catch any audio there - try recording again." : '');
        return;
    }

    setVoiceStatus('Saving voice note…');
    const ext = mimeType.indexOf('mp4') !== -1 ? 'm4a' : 'webm';

    try {
        const uploaded = await uploadNoteMediaBlob(blob, ext);
        if (uploaded.url) {
            insertAudioBlockAfterFocus(note, uploaded.url, durationSec, uploaded.path);
            setVoiceStatus('Voice note saved.');
            setTimeout(() => setVoiceStatus(''), 1500);
        } else {
            // Guest (no account) or the upload failed - fall back to
            // storing it locally exactly like before, rather than
            // losing the recording outright.
            const dataUrl = await blobToDataUrl(blob);
            insertAudioBlockAfterFocus(note, dataUrl, durationSec, null);
            if (currentUser) {
                // Logged in but the upload still failed - shows the
                // actual reason (uploaded.error) now, not just a
                // generic guess, so a repeat of this is immediately
                // diagnosable instead of needing a full re-investigation.
                setVoiceStatus(`⚠️ Saved on this device only - ${uploaded.error || 'cloud upload failed'}`);
                setTimeout(() => setVoiceStatus(''), 5000);
            } else {
                setVoiceStatus('Voice note saved.');
                setTimeout(() => setVoiceStatus(''), 1500);
            }
        }
    } catch (err) {
        setVoiceStatus("Couldn't save that recording - try again.");
    }
}

// Drops the freshly recorded clip right after whichever text block the
// cursor was last in (or at the end if nothing was focused yet), then
// opens a fresh empty text block right after it so typing can continue
// immediately - "say something, save it, keep writing."
function insertAudioBlockAfterFocus(note, dataUrl, durationSec, storagePath) {
    ensureNoteBlocks(note);

    const audioBlock = { id: genBlockId(), type: 'audio', audioData: dataUrl, storagePath: storagePath || null, duration: durationSec, label: 'Voice note', createdAt: Date.now() };
    const newTextBlock = { id: genBlockId(), type: 'text', content: '' };

    let insertAt = note.blocks.length;
    if (lastFocusedBlockId) {
        const idx = note.blocks.findIndex(b => b.id === lastFocusedBlockId);
        if (idx !== -1) insertAt = idx + 1;
    }

    note.blocks.splice(insertAt, 0, audioBlock, newTextBlock);
    lastFocusedBlockId = newTextBlock.id;

    renderNoteBlocks(note);
    scheduleNoteSave(note);

    const newTa = document.querySelector(`textarea[data-block-id="${newTextBlock.id}"]`);
    if (newTa) newTa.focus();
}

// Rebuilds the block stack in the editor pane from note.blocks. Order in
// the array is the order on screen - moving/deleting a block just edits
// this array and re-renders.
// --- BLOCK SELECTION (click a block to select it, shift-click to extend
// a range, Delete/Backspace to remove the selection) ---
// Gives every block type (text, photo, voice note) one consistent way to
// be selected and deleted, instead of each having its own always-visible
// delete button cluttering the view. Selecting a range of consecutive
// blocks (shift-click the first, shift-click the last) is also the
// practical way to remove or reorganize a whole section spanning
// several paragraphs and photos together - genuinely dragging a native
// text selection across separate block elements isn't something browsers
// support, so this is the closest equivalent: select the range of
// blocks, then delete (or, on desktop, Ctrl/Cmd+C copies their text).
let selectedBlockIds = [];

function isBlockSelected(blockId) {
    return selectedBlockIds.includes(blockId);
}

function clearBlockSelection() {
    if (selectedBlockIds.length === 0) return;
    selectedBlockIds = [];
    const note = notesData.find(n => n.id === currentNoteId);
    if (note) renderNoteBlocks(note);
}

function selectBlock(blockId, opts) {
    opts = opts || {};
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    ensureNoteBlocks(note);

    if (opts.extend && selectedBlockIds.length > 0) {
        // Shift-click: select every block between the last one selected
        // and this one, by position - so you can select a whole section
        // (paragraphs and photos together) with two clicks.
        const lastId = selectedBlockIds[selectedBlockIds.length - 1];
        const lastIdx = note.blocks.findIndex(b => b.id === lastId);
        const clickedIdx = note.blocks.findIndex(b => b.id === blockId);
        if (lastIdx !== -1 && clickedIdx !== -1) {
            const from = Math.min(lastIdx, clickedIdx);
            const to = Math.max(lastIdx, clickedIdx);
            selectedBlockIds = note.blocks.slice(from, to + 1).map(b => b.id);
        } else {
            selectedBlockIds = [blockId];
        }
    } else {
        selectedBlockIds = [blockId];
    }
    renderNoteBlocks(note);
}

// Deletes whatever's currently selected - one block or a whole range.
// Also used by deleteNoteBlock() below (kept as a thin wrapper) so the
// text/audio blocks' own persistent delete buttons keep working exactly
// as before, unchanged.
// --- TRASH / RECENTLY DELETED ---
// The gap every backup layer in this app shares (Supabase autosave,
// Dropbox, manual export) is that none of them can tell the difference
// between "the data broke" and "I meant to delete this" - they all
// faithfully protect whatever state exists, mistakes included, since a
// deletion syncs and gets backed up just as reliably as anything else.
// This is what actually closes that gap: deleting a note or a block
// (text/photo/voice note) doesn't erase it immediately - it moves here
// first, recoverable for 30 days, before being gone for real. Synced
// as part of the normal payload (see buildSyncPayload/applyCloudSnapshot)
// so it follows your account across devices like everything else.
let trashedItems = []; // { id, type: 'note'|'block', deletedAt, data, noteId?, noteTitle }
const TRASH_RETENTION_DAYS = 30;

function pushToTrash(entry) {
    trashedItems.unshift({ id: genBlockId(), deletedAt: Date.now(), ...entry });
}

// Cleans out anything past the retention window, and only NOW actually
// deletes the underlying Storage file for any photo/voice note among
// them - deletion of the real file is deferred all the way until here,
// specifically so it stays recoverable up to the last possible moment.
function purgeExpiredTrash() {
    const cutoff = Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const expiring = trashedItems.filter(t => t.deletedAt < cutoff);
    if (expiring.length === 0) return;
    expiring.forEach(purgeTrashItemMedia);
    trashedItems = trashedItems.filter(t => t.deletedAt >= cutoff);
    saveNotesData();
}

function purgeTrashItemMedia(t) {
    if (t.type === 'note' && t.data.blocks) {
        t.data.blocks.forEach(b => { if (b.storagePath) deleteNoteMediaPath(b.storagePath); });
    } else if (t.type === 'block' && t.data.storagePath) {
        deleteNoteMediaPath(t.data.storagePath);
    }
}

function daysLeftInTrash(deletedAt) {
    const msLeft = (deletedAt + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000) - Date.now();
    return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}

function restoreTrashItem(trashId) {
    const item = trashedItems.find(t => t.id === trashId);
    if (!item) return;

    if (item.type === 'note') {
        // Reuse the original note id unless something else has taken it
        // since (astronomically unlikely, but cheap to guard against).
        const restored = JSON.parse(JSON.stringify(item.data));
        if (notesData.some(n => n.id === restored.id)) restored.id = genBlockId();
        notesData.unshift(restored);
    } else if (item.type === 'block') {
        let targetNote = notesData.find(n => n.id === item.noteId);
        if (!targetNote) {
            // The note it came from is gone too (maybe trashed and
            // already purged, or never restored) - land it in a
            // dedicated recovery note instead of silently failing.
            targetNote = notesData.find(n => n.title === 'Recovered items' && n._isRecoveryNote);
            if (!targetNote) {
                targetNote = { id: genBlockId(), title: 'Recovered items', notebook: '', blocks: [], updatedAt: Date.now(), _isRecoveryNote: true };
                notesData.unshift(targetNote);
            }
        }
        ensureNoteBlocks(targetNote);
        const restoredBlock = JSON.parse(JSON.stringify(item.data));
        if (targetNote.blocks.some(b => b.id === restoredBlock.id)) restoredBlock.id = genBlockId();
        targetNote.blocks.push(restoredBlock);
        targetNote.updatedAt = Date.now();
    }

    trashedItems = trashedItems.filter(t => t.id !== trashId);
    saveNotesData();
    renderNotesList();
    renderTrashModal();
    if (currentNoteId && item.type === 'block' && notesData.find(n => n.id === currentNoteId)) {
        selectNote(currentNoteId);
    }
    showSaveToast('Restored ✓', false);
    setTimeout(() => showSaveToast('', false), 1500);
}

async function permanentlyDeleteTrashItem(trashId) {
    const ok = await showConfirmDialog('Delete this permanently? This cannot be undone.');
    if (!ok) return;
    const item = trashedItems.find(t => t.id === trashId);
    if (item) purgeTrashItemMedia(item);
    trashedItems = trashedItems.filter(t => t.id !== trashId);
    saveNotesData();
    renderTrashModal();
}

async function emptyTrash() {
    if (trashedItems.length === 0) return;
    const ok = await showConfirmDialog(`Permanently delete all ${trashedItems.length} items in Trash? This cannot be undone.`);
    if (!ok) return;
    trashedItems.forEach(purgeTrashItemMedia);
    trashedItems = [];
    saveNotesData();
    renderTrashModal();
}

function openTrashModal() {
    renderTrashModal();
    const modal = document.getElementById('trash-modal');
    if (modal) modal.style.display = 'flex';
}

function closeTrashModal() {
    const modal = document.getElementById('trash-modal');
    if (modal) modal.style.display = 'none';
}

function renderTrashModal() {
    const list = document.getElementById('trash-modal-list');
    const emptyBtn = document.getElementById('trash-empty-btn');
    const badge = document.getElementById('trash-badge-count');
    if (badge) {
        badge.textContent = trashedItems.length;
        badge.style.display = trashedItems.length > 0 ? 'flex' : 'none';
    }
    if (!list) return;

    if (emptyBtn) emptyBtn.style.display = trashedItems.length ? 'inline-flex' : 'none';

    if (trashedItems.length === 0) {
        list.innerHTML = '<div class="trash-empty-state">Nothing in Trash.</div>';
        return;
    }

    list.innerHTML = trashedItems.map(item => {
        const icon = item.type === 'note' ? '📝' : item.data.type === 'image' ? '📷' : item.data.type === 'audio' ? '🎙️' : item.data.type === 'divider' ? '➖' : '📄';
        const label = item.type === 'note'
            ? (item.data.title || 'Untitled note')
            : (item.data.type === 'text' ? (item.data.content || '').slice(0, 60) || 'Text block' : item.data.type === 'divider' ? `Divider from "${item.noteTitle}"` : `${item.data.type === 'image' ? 'Photo' : 'Voice note'} from "${item.noteTitle}"`);
        const daysLeft = daysLeftInTrash(item.deletedAt);
        return `
            <div class="trash-item-row">
                <div class="trash-item-info">
                    <span class="trash-item-icon">${icon}</span>
                    <div>
                        <div class="trash-item-label">${escapeHtml(label)}</div>
                        <div class="trash-item-meta">${daysLeft} day${daysLeft === 1 ? '' : 's'} left</div>
                    </div>
                </div>
                <div class="trash-item-actions">
                    <button type="button" class="backup-btn" onclick="restoreTrashItem('${item.id}')">Restore</button>
                    <button type="button" class="backup-btn" onclick="permanentlyDeleteTrashItem('${item.id}')">Delete forever</button>
                </div>
            </div>`;
    }).join('');
}

async function deleteSelectedBlocks() {
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note || selectedBlockIds.length === 0) return;

    let message;
    if (selectedBlockIds.length === 1) {
        const block = note.blocks.find(b => b.id === selectedBlockIds[0]);
        message = block && block.type === 'audio' ? 'Move this voice note to Trash?'
            : block && block.type === 'image' ? 'Move this photo to Trash?'
            : 'Move this to Trash?';
    } else {
        message = `Move these ${selectedBlockIds.length} items to Trash?`;
    }

    const ok = await showConfirmDialog(message);
    if (!ok) return;

    pushNotesUndoSnapshot();
    selectedBlockIds.forEach(id => {
        const block = note.blocks.find(b => b.id === id);
        if (!block) return;
        if (block.type === 'audio') releaseAudioObjectUrl(block.id);
        // Media is NOT deleted here anymore - it moves to Trash with the
        // block and only actually gets removed from Storage if it's
        // permanently deleted from Trash, or after the 30-day window.
        pushToTrash({ type: 'block', data: JSON.parse(JSON.stringify(block)), noteId: note.id, noteTitle: note.title || 'Untitled note' });
    });
    note.blocks = note.blocks.filter(b => !selectedBlockIds.includes(b.id));
    if (note.blocks.length === 0) {
        note.blocks.push({ id: genBlockId(), type: 'text', content: '' });
    }
    selectedBlockIds = [];
    renderNoteBlocks(note);
    scheduleNoteSave(note);
    renderNotesList();
}

// Delete/Backspace deletes the current selection, but only when focus
// ISN'T in a text field - otherwise this would hijack normal typing
// (deleting a character while editing a text block must always just
// delete that character). Escape clears the selection without deleting
// anything, and Ctrl/Cmd+C copies: the selected text blocks' plain text
// to the clipboard, or - if a single photo is selected - the actual
// image bytes (see copyImageBlockToClipboard), so it can be pasted into
// this note, a different one, or any other app.
document.addEventListener('keydown', (e) => {
    if (selectedBlockIds.length === 0 || !currentNoteId) return;
    const active = document.activeElement;
    const isTyping = active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT');
    if (isTyping) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelectedBlocks();
    } else if (e.key === 'Escape') {
        clearBlockSelection();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const note = notesData.find(n => n.id === currentNoteId);
        if (!note) return;
        if (selectedBlockIds.length === 1) {
            const soleBlock = note.blocks.find(b => b.id === selectedBlockIds[0]);
            if (soleBlock && soleBlock.type === 'image') {
                copyImageBlockToClipboard(soleBlock);
                return;
            }
        }
        const text = note.blocks
            .filter(b => selectedBlockIds.includes(b.id) && b.type === 'text')
            .map(b => b.content || '')
            .join('\n\n');
        if (text && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(() => {});
        }
    }
});

// Clicking anywhere in the notes editor that isn't a selectable block
// (or its selection handle) clears the current selection.
document.addEventListener('click', (e) => {
    if (selectedBlockIds.length === 0) return;
    if (!e.target.closest('[data-block-id]') && !e.target.closest('.block-select-handle')) {
        clearBlockSelection();
    }
});

function renderNoteBlocks(note) {
    ensureNoteBlocks(note);
    const container = document.getElementById('note-blocks-container');
    if (!container) return;
    container.innerHTML = '';

    note.blocks.forEach((block, index) => {
        if (block.type === 'audio') {
            container.appendChild(buildAudioBlockEl(block));
        } else if (block.type === 'image') {
            container.appendChild(buildImageBlockEl(block));
        } else if (block.type === 'divider') {
            container.appendChild(buildDividerBlockEl(block));
        } else {
            container.appendChild(buildTextBlockEl(block, index));
        }
    });

    // Empty tappable space below the last block - click/tap here to
    // land the cursor and keep writing, same as clicking at the bottom
    // of a page in a normal notes app. If the last block is already
    // text, this just focuses it and puts the cursor at the end; if it
    // ends on a photo or voice note, it opens a fresh text block first.
    const spacer = document.createElement('div');
    spacer.className = 'note-blocks-spacer';
    spacer.addEventListener('click', () => continueWritingBelow(note));
    container.appendChild(spacer);
}

function continueWritingBelow(note) {
    const blocks = note.blocks;
    const last = blocks[blocks.length - 1];

    if (last && last.type === 'text') {
        const ta = document.querySelector(`textarea[data-block-id="${last.id}"]`);
        if (ta) {
            ta.focus();
            const end = ta.value.length;
            ta.setSelectionRange(end, end);
        }
        lastFocusedBlockId = last.id;
        return;
    }

    const newBlock = { id: genBlockId(), type: 'text', content: '' };
    blocks.push(newBlock);
    lastFocusedBlockId = newBlock.id;
    renderNoteBlocks(note);
    scheduleNoteSave(note);
    const ta = document.querySelector(`textarea[data-block-id="${newBlock.id}"]`);
    if (ta) ta.focus();
}

function autoGrowTextarea(el) {
    // Resetting height to 'auto' before measuring scrollHeight briefly
    // collapses the textarea, which reflows the scrollable blocks
    // container it sits in - on phones that reflow can silently snap
    // that container's scroll position back to the top mid-keystroke,
    // which is what made long notes feel like they kept jumping back to
    // the beginning. Snapshotting scroll position beforehand and
    // restoring it right after keeps the grow effect but stops the jump.
    const container = document.getElementById('note-blocks-container');
    const containerScroll = container ? container.scrollTop : null;
    const pageScrollX = window.scrollX;
    const pageScrollY = window.scrollY;

    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';

    if (container && containerScroll !== null) container.scrollTop = containerScroll;
    if (window.scrollX !== pageScrollX || window.scrollY !== pageScrollY) {
        window.scrollTo(pageScrollX, pageScrollY);
    }
}

function buildTextBlockEl(block, index) {
    const wrap = document.createElement('div');
    wrap.className = 'note-text-block-wrap';
    wrap.dataset.blockId = block.id;
    if (isBlockSelected(block.id)) wrap.classList.add('block-selected');

    // A small grip, visible on hover, to the left of the text - clicking
    // it selects this block (shift-click extends a range across
    // whatever's between it and the last block selected, text/photos/
    // voice notes together) without interfering with a normal click
    // into the textarea, which should always just place the cursor for
    // typing.
    const handle = document.createElement('div');
    handle.className = 'block-select-handle';
    handle.title = 'Select this block';
    handle.innerHTML = '⋮⋮';
    handle.addEventListener('click', (e) => {
        e.stopPropagation();
        selectBlock(block.id, { extend: e.shiftKey });
    });
    wrap.appendChild(handle);

    const ta = document.createElement('textarea');
    ta.className = 'note-text-block';
    ta.dataset.blockId = block.id;
    ta.placeholder = index === 0 ? t('notes.writeHere') : '';
    ta.value = block.content || '';
    ta.rows = 1;

    // Snapshots the note the moment you focus into a text block - not on
    // every keystroke, which would flood the small undo stack - so
    // undoNoteAction() can restore whatever was there right before this
    // editing pass, including plain typed/deleted text, not just blocks.
    ta.addEventListener('focus', () => {
        lastFocusedBlockId = block.id;
        pushNotesUndoSnapshot();
    });
    ta.addEventListener('input', () => {
        autoGrowTextarea(ta);
        handleBlockTextEdited(block.id, ta.value);
    });

    requestAnimationFrame(() => autoGrowTextarea(ta));
    wrap.appendChild(ta);

    // Only offer up/down/delete once there's more than one block, so a
    // brand-new one-block note doesn't show useless controls. Also
    // skip it for an EMPTY text block - every photo/voice note drops a
    // fresh blank text block right after itself so you can keep typing,
    // and giving that invisible, contentless placeholder its own
    // move/delete row was what made every photo/recording look like it
    // had two trash icons (its own, plus this empty block's, stacked
    // right below it). Once you actually type something into it, it's
    // a real block and earns its controls like any other.
    const note = notesData.find(n => n.id === currentNoteId);
    const hasContent = (block.content || '').trim() !== '';
    if (note && note.blocks && note.blocks.length > 1 && hasContent) {
        const actions = document.createElement('div');
        actions.className = 'note-block-actions';
        actions.innerHTML = `
            <button type="button" class="note-block-icon-btn" onclick="moveBlock('${block.id}', -1)" title="Move up">↑</button>
            <button type="button" class="note-block-icon-btn" onclick="moveBlock('${block.id}', 1)" title="Move down">↓</button>
            <button type="button" class="note-block-icon-btn note-block-delete" onclick="deleteNoteBlock('${block.id}')" title="Delete">🗑️</button>
        `;
        wrap.appendChild(actions);
    }

    return wrap;
}

// Base64 data URLs are what actually get persisted (so recordings
// survive reload/cloud sync without a separate file store), but handing
// a large base64 "data:" URI straight to an <audio src> is where mobile
// playback falls apart - phones (mobile Safari especially) are far more
// likely to fail to decode a big inline data URI than a real Blob. A
// Blob + object URL plays reliably everywhere, so each clip is
// converted once, lazily, and the same object URL is reused after that
// - this is the fix for "records fine but I can't play it back".
const audioObjectUrlCache = new Map();

function dataUrlToObjectUrl(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return dataUrl;
    try {
        const commaIdx = dataUrl.indexOf(',');
        const header = dataUrl.slice(0, commaIdx);
        const base64 = dataUrl.slice(commaIdx + 1);
        const mimeMatch = header.match(/^data:(.*?);base64/);
        const mime = mimeMatch ? mimeMatch[1] : 'audio/webm';
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return URL.createObjectURL(new Blob([bytes], { type: mime }));
    } catch (err) {
        return dataUrl; // fall back to the raw data URL if decoding ever fails
    }
}

function getAudioPlaybackUrl(block) {
    if (!audioObjectUrlCache.has(block.id)) {
        audioObjectUrlCache.set(block.id, dataUrlToObjectUrl(block.audioData));
    }
    return audioObjectUrlCache.get(block.id);
}

function releaseAudioObjectUrl(blockId) {
    const url = audioObjectUrlCache.get(blockId);
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
    audioObjectUrlCache.delete(blockId);
}

function buildAudioBlockEl(block) {
    const wrap = document.createElement('div');
    wrap.className = 'note-audio-block';
    wrap.dataset.blockId = block.id;
    if (isBlockSelected(block.id)) wrap.classList.add('block-selected');

    wrap.innerHTML = `
        <div class="note-audio-row">
            <div class="block-select-handle" title="Select this block">⋮⋮</div>
            <button type="button" class="note-audio-play-btn" onclick="toggleAudioBlockPlay('${block.id}')" id="play-btn-${block.id}">▶</button>
            <div class="note-audio-info">
                <input type="text" class="note-audio-label" value="${escapeHtml(block.label || 'Voice note')}" oninput="handleAudioLabelEdited('${block.id}', this.value)" onfocus="setLastFocusedBlock('${block.id}')">
                <span class="note-audio-duration" id="dur-${block.id}">${formatAudioDuration(block.duration)}</span>
            </div>
            <div class="note-audio-actions">
                <button type="button" class="note-audio-icon-btn" onclick="moveBlock('${block.id}', -1)" title="Move up">↑</button>
                <button type="button" class="note-audio-icon-btn" onclick="moveBlock('${block.id}', 1)" title="Move down">↓</button>
                <button type="button" class="note-audio-icon-btn note-audio-delete" onclick="deleteNoteBlock('${block.id}')" title="Delete recording">🗑️</button>
            </div>
        </div>
        <audio class="note-audio-el" id="audio-${block.id}" src="${getAudioPlaybackUrl(block)}" preload="metadata" playsinline></audio>
    `;

    const handle = wrap.querySelector('.block-select-handle');
    handle.addEventListener('click', (e) => {
        e.stopPropagation();
        selectBlock(block.id, { extend: e.shiftKey });
    });

    const audioEl = wrap.querySelector('audio');
    audioEl.addEventListener('ended', () => {
        const btn = document.getElementById(`play-btn-${block.id}`);
        if (btn) btn.innerText = '▶';
    });
    audioEl.addEventListener('loadedmetadata', () => {
        if ((!block.duration || !isFinite(block.duration)) && isFinite(audioEl.duration)) {
            block.duration = audioEl.duration;
            const durEl = document.getElementById(`dur-${block.id}`);
            if (durEl) durEl.innerText = formatAudioDuration(block.duration);
        }
    });
    // Surfaces a real error instead of a recording that just silently
    // never plays - the file itself failing to load/decode (a broken
    // upload, a format this browser can't play, a dead link) shows up
    // here even when play() itself didn't reject.
    audioEl.addEventListener('error', () => {
        const btn = document.getElementById(`play-btn-${block.id}`);
        if (btn) btn.innerText = '▶';
        setVoiceStatus("This recording couldn't be loaded - it may be corrupted or in a format this browser can't play.");
        setTimeout(() => setVoiceStatus(''), 4000);
    });

    return wrap;
}

function toggleAudioBlockPlay(blockId) {
    const audioEl = document.getElementById(`audio-${blockId}`);
    const btn = document.getElementById(`play-btn-${blockId}`);
    if (!audioEl) return;

    // Pause any other note recording that's currently playing.
    document.querySelectorAll('.note-audio-el').forEach(el => {
        if (el !== audioEl && !el.paused) {
            el.pause();
            const otherBtn = document.getElementById(`play-btn-${el.id.replace('audio-', '')}`);
            if (otherBtn) otherBtn.innerText = '▶';
        }
    });

    if (audioEl.paused) {
        // play() returns a Promise that can reject (blocked by the
        // browser, or the file failing to decode) - previously this
        // wasn't checked at all, so the button flipped to "playing"
        // even when nothing actually played, which is exactly what
        // made failed playback look like nothing happened. Now a
        // failure shows an actual message and puts the button back.
        const playPromise = audioEl.play();
        if (btn) btn.innerText = '⏸';
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(err => {
                if (btn) btn.innerText = '▶';
                console.error('Voice note playback failed:', err);
                setVoiceStatus("Couldn't play that recording - it may not have saved correctly.");
                setTimeout(() => setVoiceStatus(''), 3000);
            });
        }
    } else {
        audioEl.pause();
        if (btn) btn.innerText = '▶';
    }
}

// --- PHOTOS (inline blocks) ---
// Same idea as voice notes: an image block sits inline in the blocks
// array wherever you drop it, and can be moved/deleted like anything
// else. Photos come from the phone's camera roll (or camera directly,
// on mobile - the file input has no `capture` attribute so iOS/Android
// offer "Photo Library" as well as "Take Photo"). Before saving, every
// image is downscaled + re-encoded as JPEG on a canvas - an iPhone
// screenshot or photo can be several MB straight off the camera roll,
// and since these ride along as base64 inside the same localStorage/
// cloud sync payload as everything else, that would fill up storage
// fast. Capping the longest side and compressing keeps each photo
// small while still looking sharp in the note.
const NOTE_IMAGE_MAX_DIMENSION = 1600;
const NOTE_IMAGE_JPEG_QUALITY = 0.75;

function triggerPhotoUpload() {
    if (!currentNoteId) return;
    const input = document.getElementById('note-photo-input');
    if (input) input.click();
}

// Reads a File into a downscaled, JPEG-compressed Blob via canvas.
// Drawing the source image onto a canvas at a capped size does the
// resize; re-exporting as JPEG (instead of keeping PNG) is what
// actually shrinks screenshots down, since PNG doesn't compress
// photographic/screenshot content nearly as well. Resolves a Blob
// (not a data URL) since that's what Storage upload needs directly -
// callers on the guest/offline fallback path convert it via
// blobToDataUrl instead.
function compressImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > NOTE_IMAGE_MAX_DIMENSION || height > NOTE_IMAGE_MAX_DIMENSION) {
                    const scale = NOTE_IMAGE_MAX_DIMENSION / Math.max(width, height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => blob ? resolve(blob) : reject(new Error('Could not compress that image.')),
                    'image/jpeg',
                    NOTE_IMAGE_JPEG_QUALITY
                );
            };
            img.onerror = () => reject(new Error('Could not read that image.'));
            img.src = reader.result;
        };
        reader.onerror = () => reject(new Error('Could not read that file.'));
        reader.readAsDataURL(file);
    });
}

// Handles one or more files chosen from the picker - drops each one in
// as an image block, in order, right after wherever the cursor last
// was (same placement logic as voice notes), then resets the input so
// picking the exact same file again still fires a change event.
function handlePhotoFilesSelected(event) {
    const files = Array.from(event.target.files || []).filter(f => f.type.startsWith('image/'));
    event.target.value = '';
    addPhotoFilesToCurrentNote(files);
}

// Shared by the file picker and the Ctrl+V paste handler below - both
// end up with a list of image Files/Blobs that need compressing and
// dropping into the note one after another.
async function addPhotoFilesToCurrentNote(files) {
    if (!files.length || !currentNoteId) return;

    const btn = document.getElementById('notes-photo-btn');
    if (btn) { btn.classList.add('uploading'); btn.disabled = true; }
    setVoiceStatus(files.length > 1 ? 'Adding photos…' : 'Adding photo…');

    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) { if (btn) { btn.classList.remove('uploading'); btn.disabled = false; } return; }

    let usedFallback = false;
    let lastUploadError = null;
    try {
        for (const file of files) {
            const blob = await compressImageFile(file);
            const uploaded = await uploadNoteMediaBlob(blob, 'jpg');
            if (uploaded.url) {
                insertImageBlockAfterFocus(note, uploaded.url, uploaded.path);
            } else {
                // Guest (no account) or the upload failed - fall back to
                // storing it locally exactly like before, rather than
                // losing the photo outright.
                usedFallback = true;
                if (uploaded.error) lastUploadError = uploaded.error;
                const dataUrl = await blobToDataUrl(blob);
                insertImageBlockAfterFocus(note, dataUrl, null);
            }
        }
        if (usedFallback && currentUser) {
            // Logged in but the upload still failed - shows the actual
            // reason now (lastUploadError), not just a generic guess, so
            // this is immediately diagnosable if it happens again rather
            // than needing a full re-investigation. This photo will
            // still auto-migrate to Storage next time uploads do work
            // (see migrateBase64MediaToStorage).
            setVoiceStatus(`⚠️ Saved on this device only - ${lastUploadError || 'cloud upload failed'}`);
        } else {
            setVoiceStatus(files.length > 1 ? 'Photos added.' : 'Photo added.');
        }
    } catch (err) {
        setVoiceStatus("Couldn't add that photo - try a different one.");
    } finally {
        if (btn) { btn.classList.remove('uploading'); btn.disabled = false; }
        setTimeout(() => setVoiceStatus(''), usedFallback ? 4000 : 1500);
    }
}

// Lets you paste a screenshot straight into a note with Ctrl+V (or
// Cmd+V) - e.g. a Windows "Win+Shift+S" snip or a Mac screenshot still
// sitting on the clipboard. Only kicks in when a note is actually open
// and the clipboard contains an image; otherwise a normal text paste
// goes through untouched.
document.addEventListener('paste', (e) => {
    if (!currentNoteId) return;
    const editor = document.getElementById('notes-editor');
    if (!editor || editor.style.display === 'none') return;

    const items = (e.clipboardData || window.clipboardData) ? (e.clipboardData || window.clipboardData).items : null;
    if (!items) return;

    const imageFiles = [];
    for (const item of items) {
        if (item.kind === 'file' && item.type && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) imageFiles.push(file);
        }
    }
    if (!imageFiles.length) return; // no image on the clipboard - let normal text paste happen

    e.preventDefault();
    addPhotoFilesToCurrentNote(imageFiles);
});

// Drops the photo right after whichever block the cursor was last in
// (or at the end), mirroring insertAudioBlockAfterFocus - and, same as
// a voice note, opens a fresh empty text block right after it and
// focuses that. That does two things: gives you somewhere to
// immediately keep typing (no more dead click below the photo), and
// keeps lastFocusedBlockId pointing at that new text block, so the
// *next* thing you add (typed text or another photo) lands after it
// instead of always piling up in the same spot.
// Inserts a full-width divider line at the cursor - the toolbar
// button version of typing a row of dashes to separate ideas, which
// is common enough to deserve one click. Same insert-after-focus
// placement as photos/voice notes, and a fresh text block right after
// so you can keep typing immediately.
function insertDividerBlock() {
    if (!currentNoteId) return;
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    pushNotesUndoSnapshot();
    ensureNoteBlocks(note);

    const dividerBlock = { id: genBlockId(), type: 'divider' };
    const newTextBlock = { id: genBlockId(), type: 'text', content: '' };

    let insertAt = note.blocks.length;
    if (lastFocusedBlockId) {
        const idx = note.blocks.findIndex(b => b.id === lastFocusedBlockId);
        if (idx !== -1) insertAt = idx + 1;
    }

    note.blocks.splice(insertAt, 0, dividerBlock, newTextBlock);
    lastFocusedBlockId = newTextBlock.id;

    renderNoteBlocks(note);
    scheduleNoteSave(note);
    renderNotesList();

    const newTa = document.querySelector(`textarea[data-block-id="${newTextBlock.id}"]`);
    if (newTa) newTa.focus();
}

function buildDividerBlockEl(block) {
    const wrap = document.createElement('div');
    wrap.className = 'note-divider-block';
    wrap.dataset.blockId = block.id;
    if (isBlockSelected(block.id)) wrap.classList.add('block-selected');
    wrap.innerHTML = `<div class="note-divider-line"></div>`;
    wrap.addEventListener('click', (e) => {
        e.stopPropagation();
        selectBlock(block.id, { extend: e.shiftKey });
    });
    return wrap;
}

function insertImageBlockAfterFocus(note, dataUrl, storagePath) {
    ensureNoteBlocks(note);

    const imageBlock = { id: genBlockId(), type: 'image', imageData: dataUrl, storagePath: storagePath || null, caption: '', createdAt: Date.now() };
    const newTextBlock = { id: genBlockId(), type: 'text', content: '' };

    let insertAt = note.blocks.length;
    if (lastFocusedBlockId) {
        const idx = note.blocks.findIndex(b => b.id === lastFocusedBlockId);
        if (idx !== -1) insertAt = idx + 1;
    }

    note.blocks.splice(insertAt, 0, imageBlock, newTextBlock);
    lastFocusedBlockId = newTextBlock.id;

    renderNoteBlocks(note);
    scheduleNoteSave(note);
    renderNotesList();

    const newTa = document.querySelector(`textarea[data-block-id="${newTextBlock.id}"]`);
    if (newTa) newTa.focus();
}

// Lets a block be re-selected as the insertion point without typing in
// it - used by the audio label and photo caption inputs, which don't
// have their own text-block focus listener the way textareas do.
function setLastFocusedBlock(blockId) {
    lastFocusedBlockId = blockId;
}

const NOTE_IMAGE_MIN_WIDTH_PX = 120;

// Called when a note photo's <img> fails to load - instead of the
// browser's default silent broken-image icon (which gives zero
// information about WHY), this shows a clear message plus the actual
// URL that failed, so the difference between "this link expired" and
// "the storage bucket/permissions broke" is actually visible instead of
// a mystery.
function handleNoteImageError(imgEl) {
    if (imgEl.dataset.errorHandled) return; // guard against onerror firing repeatedly
    imgEl.dataset.errorHandled = 'true';
    const failedUrl = imgEl.src;
    const wrap = imgEl.closest('.note-image-thumb-wrap');
    if (!wrap) return;
    wrap.innerHTML = `
        <div class="note-image-broken">
            <div class="note-image-broken-icon">⚠️</div>
            <div class="note-image-broken-text">This photo couldn't load.</div>
            <div class="note-image-broken-url" title="${escapeHtml(failedUrl)}">${escapeHtml(failedUrl.length > 60 ? failedUrl.slice(0, 60) + '…' : failedUrl)}</div>
        </div>`;
}

function buildImageBlockEl(block) {
    const wrap = document.createElement('div');
    wrap.className = 'note-image-block';
    wrap.dataset.blockId = block.id;
    if (isBlockSelected(block.id)) wrap.classList.add('block-selected');

    const widthStyle = block.widthPercent ? ` style="width:${block.widthPercent}%;"` : '';

    // Just the photo - no bordered "card" around it, no caption field,
    // no separate row of buttons underneath. A click selects it (a thin
    // outline shows that, drawn on the photo itself rather than a
    // surrounding box); Delete/Backspace removes it and Ctrl+C copies
    // the actual image to the system clipboard while it's selected (see
    // the keydown handler and copyImageBlockToClipboard below). Dragging
    // from near the image's own edge/corner resizes it - see
    // attachImageResizeHandlers - so there's no separate handle icon
    // sitting on top of the photo either.
    wrap.innerHTML = `
        <div class="note-image-thumb-wrap"${widthStyle}>
            <img class="note-image-thumb" src="${block.imageData}" alt="Note photo" onerror="handleNoteImageError(this)">
        </div>
    `;

    const thumbWrap = wrap.querySelector('.note-image-thumb-wrap');
    const img = wrap.querySelector('.note-image-thumb');
    attachImageResizeHandlers(img, thumbWrap, block);

    img.addEventListener('click', (e) => {
        e.stopPropagation();
        selectBlock(block.id, { extend: e.shiftKey });
    });
    img.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        openPhotoLightbox(block.id);
    });

    return wrap;
}

// Drag-to-resize: grabbing near the photo's own right/bottom edge (no
// separate handle element to hunt for) scales its width - height
// follows automatically since the image keeps its aspect ratio -
// between a small minimum and the full width of the note pane. Uses
// Pointer Events so the same code handles mouse drags on desktop and
// finger drags on mobile. A plain click anywhere else on the photo
// still falls through to the normal select/open-lightbox handlers
// above, since the pointerdown listener here only acts (and only
// preventDefaults/stops the event) when the pointer actually started
// near an edge.
const NOTE_IMAGE_RESIZE_EDGE_PX = 18;

function attachImageResizeHandlers(img, thumbWrap, block) {
    let startX = 0;
    let startWidthPx = 0;
    let containerWidthPx = 0;
    let dragging = false;

    function isNearResizeEdge(e) {
        const rect = img.getBoundingClientRect();
        const nearRight = (rect.right - e.clientX) <= NOTE_IMAGE_RESIZE_EDGE_PX;
        const nearBottom = (rect.bottom - e.clientY) <= NOTE_IMAGE_RESIZE_EDGE_PX;
        return nearRight || nearBottom;
    }

    function onPointerMove(e) {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const newWidthPx = Math.max(NOTE_IMAGE_MIN_WIDTH_PX, Math.min(startWidthPx + dx, containerWidthPx));
        thumbWrap.style.width = newWidthPx + 'px';
    }

    function onPointerUp() {
        if (!dragging) return;
        dragging = false;
        img.style.cursor = '';
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);

        const finalWidthPx = thumbWrap.getBoundingClientRect().width;
        const percent = Math.round(Math.max(20, Math.min(100, (finalWidthPx / containerWidthPx) * 100)));
        block.widthPercent = percent;
        thumbWrap.style.width = percent + '%';

        const note = notesData.find(n => n.id === currentNoteId);
        if (note) scheduleNoteSave(note);
    }

    // Hover feedback so the resizable edge is discoverable without a
    // visible handle graphic sitting on the photo.
    img.addEventListener('pointermove', (e) => {
        if (dragging) return;
        img.style.cursor = isNearResizeEdge(e) ? 'nwse-resize' : 'pointer';
    });
    img.addEventListener('pointerleave', () => {
        if (!dragging) img.style.cursor = '';
    });

    img.addEventListener('pointerdown', (e) => {
        if (!isNearResizeEdge(e)) return; // not near the edge - let it act as a normal click (select/open)
        e.preventDefault();
        e.stopPropagation();
        dragging = true;
        startX = e.clientX;
        startWidthPx = thumbWrap.getBoundingClientRect().width;
        containerWidthPx = thumbWrap.parentElement.getBoundingClientRect().width;
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    });
}

// Puts the actual image bytes on the system clipboard (not just an
// internal reference) when a single selected photo is copied with
// Ctrl/Cmd+C - so it can be pasted straight into another app exactly
// like copying any other image, the same way copying it back into this
// note (or a different one) works for free too, since Ctrl+V here
// already knows how to turn a pasted image into a block (see the
// 'paste' listener below). Re-encodes through a canvas to PNG first,
// since clipboard image writes aren't reliably supported as JPEG
// across browsers even though photos are stored as JPEG to keep their
// file size down.
async function copyImageBlockToClipboard(block) {
    if (!navigator.clipboard || !window.ClipboardItem) {
        setVoiceStatus("Copying photos isn't supported in this browser.");
        setTimeout(() => setVoiceStatus(''), 2500);
        return;
    }
    const pngBlobPromise = (async () => {
        const resp = await fetch(block.imageData);
        const blob = await resp.blob();
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext('2d').drawImage(bitmap, 0, 0);
        return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    })();

    try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlobPromise })]);
        setVoiceStatus('Photo copied - paste it anywhere.');
        setTimeout(() => setVoiceStatus(''), 1800);
    } catch (err) {
        setVoiceStatus("Couldn't copy that photo.");
        setTimeout(() => setVoiceStatus(''), 2000);
    }
}

// Full-screen preview: tapping the thumbnail opens the photo at full
// size over a dark backdrop; tapping the backdrop, the ✕, or Escape
// closes it again.
function openPhotoLightbox(blockId) {
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    const block = note.blocks.find(b => b.id === blockId);
    if (!block || block.type !== 'image') return;

    const overlay = document.getElementById('photo-lightbox');
    const img = document.getElementById('photo-lightbox-img');
    if (!overlay || !img) return;
    img.src = block.imageData;
    overlay.style.display = 'flex';
}

function closePhotoLightbox(event) {
    // Ignore clicks on the image itself so tapping the photo doesn't close it.
    if (event && event.target && event.target.id === 'photo-lightbox-img') return;
    const overlay = document.getElementById('photo-lightbox');
    if (overlay) overlay.style.display = 'none';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePhotoLightbox();
});

function handleBlockTextEdited(blockId, value) {
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    const block = note.blocks.find(b => b.id === blockId);
    if (!block) return;
    block.content = value;
    scheduleNoteSave(note);
}

function handleAudioLabelEdited(blockId, value) {
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    const block = note.blocks.find(b => b.id === blockId);
    if (!block) return;
    block.label = value;
    scheduleNoteSave(note);
}

// Swaps a block with its neighbor in the array - the "move it around"
// control for repositioning a recording (or a paragraph) relative to
// what's next to it. Works the same for text and audio blocks.
function moveBlock(blockId, direction) {
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    const idx = note.blocks.findIndex(b => b.id === blockId);
    const newIdx = idx + direction;
    if (idx === -1 || newIdx < 0 || newIdx >= note.blocks.length) return;

    [note.blocks[idx], note.blocks[newIdx]] = [note.blocks[newIdx], note.blocks[idx]];
    renderNoteBlocks(note);
    scheduleNoteSave(note);
}

// Renamed from the old deleteBlock(blockId) - it was accidentally sharing
// its name with the calendar's deleteBlock(dateKey, index) above, and since
// function declarations later in the file win, this one was silently
// shadowing that one everywhere the calendar tried to delete a block.
//
// Now a thin wrapper around the unified block-selection system above
// (selectBlock + deleteSelectedBlocks) - selects just this one block and
// deletes it, so every existing call site (the text/audio blocks' own
// persistent delete buttons) keeps working exactly as before, unchanged.
function deleteNoteBlock(blockId) {
    selectedBlockIds = [blockId];
    return deleteSelectedBlocks();
}

// Belt-and-suspenders: don't leave the mic hot if the tab closes mid-recording.
window.addEventListener('beforeunload', () => {
    stopNoteRecordingIfActive();
    releaseNoteRecordingStreamForGood();
});

// "+ New" makes a blank note, drops it at the top of the list, selects
// it, and focuses the title field - no category prompt, no confirm step.
// You just start typing and it's saved a moment later.
function createNote() {
    const notebook = activeNotebookFilter || '';
    // Auto-title new notes inside a notebook as "Notebook N" (Coding 1,
    // Coding 2, ...) so notes in a group are pre-organized without typing
    // - still just a starting title, fully editable like any other.
    let title = '';
    if (notebook) {
        const countInNotebook = notesData.filter(n => n.notebook === notebook).length;
        title = `${notebook} ${countInNotebook + 1}`;
    }

    const note = {
        id: 'note_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        title,
        category: '',
        notebook,
        blocks: [{ id: genBlockId(), type: 'text', content: '' }],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    notesData.unshift(note);
    saveNotesData();
    selectNote(note.id);

    const titleInput = document.getElementById('note-title-input');
    if (titleInput) {
        titleInput.focus();
        titleInput.select();
    }
}

function saveNotebooks() {
    localStorage.setItem('notesNotebooks', JSON.stringify(notesNotebooks));
}

// Renders the notebook picker dropdown: "All Notes" plus every notebook
// that's ever been created, kept in sync with activeNotebookFilter.
function renderNotebookSelector() {
    const datalist = document.getElementById('notebook-list');
    if (datalist) {
        datalist.innerHTML = notesNotebooks.map(nb => `<option value="${escapeHtml(nb)}"></option>`).join('');
    }

    const select = document.getElementById('notebook-filter-select');
    if (!select) return;

    select.innerHTML = [`<option value="">${t('notes.allNotesOption')}</option>`]
        .concat(notesNotebooks.map(nb => `<option value="${escapeHtml(nb)}">${escapeHtml(nb)}</option>`))
        .join('');
    select.value = activeNotebookFilter;

    const delBtn = document.querySelector('.notebook-del-btn');
    if (delBtn) delBtn.style.display = activeNotebookFilter ? 'inline-flex' : 'none';
}

function handleNotebookFilterChange(value) {
    activeNotebookFilter = value;
    localStorage.setItem('activeNotebookFilter', activeNotebookFilter);
    renderNotesList();
}

// Prompts for a new notebook name (e.g. "Coding") and switches the list to
// it. Notes created while it's active get auto-numbered into it.
function createNotebook() {
    const name = prompt('Name this notebook (e.g. "Coding", "Journal"):');
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) return;

    if (!notesNotebooks.includes(trimmed)) {
        notesNotebooks.push(trimmed);
        saveNotebooks();
    }

    activeNotebookFilter = trimmed;
    localStorage.setItem('activeNotebookFilter', activeNotebookFilter);
    renderNotebookSelector();
    renderNotesList();
}

// Deletes a notebook grouping itself (not the notes in it - they just lose
// their notebook tag and fall back into "All Notes").
async function deleteCurrentNotebook() {
    if (!activeNotebookFilter) return;
    const ok = await showConfirmDialog(`Delete the notebook "${activeNotebookFilter}"? Notes inside it will stay, just ungrouped.`);
    if (!ok) return;

    const removed = activeNotebookFilter;
    notesNotebooks = notesNotebooks.filter(nb => nb !== removed);
    notesData.forEach(n => { if (n.notebook === removed) n.notebook = ''; });
    saveNotebooks();
    saveNotesData();

    activeNotebookFilter = '';
    localStorage.setItem('activeNotebookFilter', '');
    renderNotebookSelector();
    renderNotesList();
}

function handleNotesSearch(value) {
    notesSearchQuery = (value || '').trim().toLowerCase();
    renderNotesList();
}

function renderNotesList() {
    const list = document.getElementById('notes-list');
    const badge = document.getElementById('notes-count-badge');
    if (!list) return;

    const sortSelect = document.getElementById('notes-sort-select');
    if (sortSelect) sortSelect.value = notesSortMode;

    let visibleNotes = notesData;
    if (activeNotebookFilter) {
        visibleNotes = visibleNotes.filter(n => n.notebook === activeNotebookFilter);
    }
    if (notesSearchQuery) {
        visibleNotes = visibleNotes.filter(n => {
            const title = (n.title || '').toLowerCase();
            if (title.includes(notesSearchQuery)) return true;
            return getNotePreviewText(n).toLowerCase().includes(notesSearchQuery);
        });
    }
    if (notesSortMode === 'alpha') {
        visibleNotes = [...visibleNotes].sort((a, b) =>
            (a.title || 'Untitled note').localeCompare(b.title || 'Untitled note', undefined, { sensitivity: 'base' })
        );
    }

    if (badge) badge.innerText = visibleNotes.length;

    list.innerHTML = '';

    if (visibleNotes.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'notes-empty-msg';
        if (notesData.length === 0) {
            empty.innerText = t('notes.emptyNoNotes');
        } else if (notesSearchQuery) {
            empty.innerText = t('notes.emptySearch');
        } else {
            empty.innerText = t('notes.emptyNotebook');
        }
        list.appendChild(empty);
        return;
    }

    // Dragging to reorder only makes unambiguous sense when the list
    // shown IS notesData's own order, unfiltered and unsorted -
    // otherwise "drop it here" wouldn't map cleanly back onto where it
    // actually belongs in the underlying array.
    const canDragReorder = notesSortMode === 'custom' && !activeNotebookFilter && !notesSearchQuery;

    visibleNotes.forEach(note => {
        const item = document.createElement('div');
        item.className = 'note-list-item';
        if (note.id === currentNoteId) item.classList.add('active');

        // The "miniature" (this row) picks up the note's custom page
        // color as a soft tint + matching border, same as the full page.
        // Falls back to the category color when no page color is set.
        if (note.color) {
            item.style.borderLeftColor = note.color;
            item.style.background = `color-mix(in srgb, ${note.color} 16%, var(--card-bg))`;
        } else {
            item.style.borderLeftColor = getNoteColor(note.notebook);
        }

        const dateLabel = new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const voiceCount = getNoteVoiceCount(note);
        const voiceBadge = voiceCount > 0
            ? `<div class="note-list-item-voice-badge">🎙️ ${voiceCount} voice note${voiceCount > 1 ? 's' : ''}</div>`
            : '';
        const photoCount = getNoteImageCount(note);
        const photoBadge = photoCount > 0
            ? `<div class="note-list-item-photo-badge">📷 ${photoCount} photo${photoCount > 1 ? 's' : ''}</div>`
            : '';

        // Notebook now lives here on the miniature instead of as a field
        // inside the open note (desktop still also shows the field in the
        // open note) - tap it to move the note to a different notebook
        // without having to open it first. Used to point at note.category
        // (colored/autocompleted the same as the calendar's own activity
        // categories, which never made sense for a note) - now reflects
        // which actual notebook the note belongs to.
        const notebookColor = getNoteColor(note.notebook);
        const notebookLabel = note.notebook ? escapeHtml(note.notebook) : '+ notebook';
        const categoryBadge = `<button type="button" class="note-list-item-category${note.notebook ? '' : ' note-list-item-category-empty'}" style="color:${notebookColor}; border-color:${notebookColor};" onclick="event.stopPropagation(); openNoteNotebookPicker('${note.id}')" title="Set notebook">${notebookLabel}</button>`;

        item.innerHTML = `
            <div class="note-list-item-title">${note.title ? escapeHtml(note.title) : 'Untitled note'}</div>
            <div class="note-list-item-preview">${escapeHtml(getNotePreviewText(note))}</div>
            ${voiceBadge}
            ${photoBadge}
            <div class="note-list-item-footer">
                ${categoryBadge}
                <div class="note-list-item-date">${dateLabel}</div>
            </div>
        `;

        item.addEventListener('click', () => selectNote(note.id));

        if (canDragReorder) {
            item.draggable = true;
            item.addEventListener('dragstart', (e) => {
                draggedNoteId = note.id;
                item.classList.add('dragging');
                if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedNoteId = null;
                list.querySelectorAll('.note-drop-target').forEach(el => el.classList.remove('note-drop-target'));
            });
            item.addEventListener('dragover', (e) => {
                if (!draggedNoteId || draggedNoteId === note.id) return;
                e.preventDefault();
                item.classList.add('note-drop-target');
            });
            item.addEventListener('dragleave', () => {
                item.classList.remove('note-drop-target');
            });
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('note-drop-target');
                if (!draggedNoteId || draggedNoteId === note.id) return;
                reorderNote(draggedNoteId, note.id);
                draggedNoteId = null;
            });
        }

        list.appendChild(item);
    });
}

function handleNotesSortChange(value) {
    notesSortMode = value;
    localStorage.setItem('notesSortMode', value);
    renderNotesList();
}

// Moves a note to sit right where another one was dropped on, in
// notesData's own underlying order - only reachable while "My order"
// is selected and the list isn't filtered/searched (see
// canDragReorder above), so the indices always line up 1:1 with what's
// on screen.
function reorderNote(sourceId, targetId) {
    const fromIdx = notesData.findIndex(n => n.id === sourceId);
    const toIdx = notesData.findIndex(n => n.id === targetId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const [moved] = notesData.splice(fromIdx, 1);
    notesData.splice(toIdx, 0, moved);
    saveNotesData();
    renderNotesList();
}

// Opens the notebook-picker modal for a given note - a proper dropdown of
// existing notebooks (plus a field to create a new one) instead of a
// plain prompt() asking you to remember/retype a name exactly.
let notebookPickerNoteId = null;
function openNoteNotebookPicker(noteId) {
    const note = notesData.find(n => n.id === noteId);
    if (!note) return;
    notebookPickerNoteId = noteId;

    const select = document.getElementById('notebook-picker-select');
    const newInput = document.getElementById('notebook-picker-new-input');
    if (select) {
        select.innerHTML = '<option value="">No notebook</option>' +
            notesNotebooks.map(nb => `<option value="${escapeHtml(nb)}">${escapeHtml(nb)}</option>`).join('');
        select.value = notesNotebooks.includes(note.notebook) ? note.notebook : '';
    }
    if (newInput) newInput.value = '';

    const modal = document.getElementById('notebook-picker-modal');
    if (modal) modal.style.display = 'flex';
}

function closeNotebookPickerModal() {
    notebookPickerNoteId = null;
    const modal = document.getElementById('notebook-picker-modal');
    if (modal) modal.style.display = 'none';
}

function saveNotebookPickerModal() {
    const note = notesData.find(n => n.id === notebookPickerNoteId);
    if (!note) { closeNotebookPickerModal(); return; }

    const select = document.getElementById('notebook-picker-select');
    const newInput = document.getElementById('notebook-picker-new-input');
    const newName = newInput ? newInput.value.trim() : '';
    const chosen = newName || (select ? select.value : '');

    if (newName && !notesNotebooks.includes(newName)) {
        notesNotebooks.push(newName);
        saveNotebooks();
        renderNotebookSelector();
    }

    note.notebook = chosen;
    note.updatedAt = Date.now();

    if (note.id === currentNoteId) {
        const catInput = document.getElementById('note-category-input');
        if (catInput) catInput.value = note.notebook || '';
    }

    saveNotesData();
    renderNotesList();
    closeNotebookPickerModal();
}

// Loads a note into the right-hand editing pane. Flushes any pending
// autosave from whichever note was open before, so switching notes right
// after typing never loses the last few keystrokes.
function selectNote(id) {
    flushNoteSave();
    stopNoteRecordingIfActive(); // release the mic if we were mid-recording on a different note

    const note = notesData.find(n => n.id === id);
    if (!note) return;
    currentNoteId = id;
    lastFocusedBlockId = null;

    document.getElementById('note-title-input').value = note.title || '';
    document.getElementById('note-category-input').value = note.notebook || '';
    renderNoteBlocks(note);

    const indicator = document.getElementById('note-saved-indicator');
    if (indicator) indicator.classList.remove('visible');

    const emptyState = document.getElementById('notes-empty-state');
    const editor = document.getElementById('notes-editor');
    if (emptyState) emptyState.style.display = 'none';
    if (editor) editor.style.display = 'flex';

    applyNotePageColor(note);
    renderNoteColorSwatches();
    setVoiceStatus('');

    setMobileNotesView('detail'); // no-op on desktop; on phone, switches from the list to this note

    renderNotesList(); // re-render so the clicked item picks up '.active'
}

function flushNoteSave() {
    if (noteSaveDebounceTimer) {
        clearTimeout(noteSaveDebounceTimer);
        noteSaveDebounceTimer = null;
        saveNotesData();
    }
    flushCloudSync();
}

// Autosaves the title/category the moment they change; block edits
// (typing in a text block, recording, moving, deleting) go through
// scheduleNoteSave directly. There's no Save button on purpose - write
// something and it stays, delete something and it stays deleted.
function handleNoteEdited() {
    if (!currentNoteId) return;
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;

    note.title = document.getElementById('note-title-input').value;
    note.notebook = document.getElementById('note-category-input').value.trim();

    scheduleNoteSave(note);
}

// Registers a newly-typed notebook name into the master list (the one
// the notebook filter dropdown and every note's own Notebook field
// autocomplete from) once you're actually done typing it - on blur or
// Enter, not on every keystroke. Registering on every keystroke (the
// old behavior) meant typing a brand-new name like "Coding" letter by
// letter silently added "C", "Co", "Cod"... as separate half-typed
// notebooks along the way, which is why the notebook list looked like
// it wasn't working right.
function commitNoteNotebook() {
    const notebookValue = document.getElementById('note-category-input').value.trim();
    if (notebookValue && !notesNotebooks.includes(notebookValue)) {
        notesNotebooks.push(notebookValue);
        saveNotebooks();
        renderNotebookSelector();
    }
}

// Shared debounced save used by every kind of edit (title, category, any
// block) so we're not hitting localStorage/cloud sync on every keystroke.
function scheduleNoteSave(note) {
    note.updatedAt = Date.now();

    const indicator = document.getElementById('note-saved-indicator');
    if (indicator) {
        indicator.innerText = 'Saving…';
        indicator.classList.add('visible');
    }

    clearTimeout(noteSaveDebounceTimer);
    noteSaveDebounceTimer = setTimeout(() => {
        saveNotesData();
        noteSaveDebounceTimer = null;
        renderNotesList(); // keeps the sidebar's title/preview/date live while staying selected
        if (indicator) {
            indicator.innerText = 'Saved';
            setTimeout(() => indicator.classList.remove('visible'), 1200);
        }
    }, 500);
}

async function deleteCurrentNote() {
    if (!currentNoteId) return;
    const ok = await showConfirmDialog('Move this note to Trash? You can restore it for 30 days.');
    if (!ok) return;

    stopNoteRecordingIfActive();
    pushNotesUndoSnapshot();
    const deletedNote = notesData.find(n => n.id === currentNoteId);
    if (deletedNote) {
        if (deletedNote.blocks) deletedNote.blocks.forEach(b => { if (b.type === 'audio') releaseAudioObjectUrl(b.id); });
        // Media is NOT deleted here anymore - the whole note (and its
        // photos/voice notes) moves to Trash intact, only actually
        // removed from Storage on permanent delete or after 30 days.
        pushToTrash({ type: 'note', data: JSON.parse(JSON.stringify(deletedNote)), noteTitle: deletedNote.title || 'Untitled note' });
    }
    notesData = notesData.filter(n => n.id !== currentNoteId);
    saveNotesData();
    currentNoteId = null;

    const emptyState = document.getElementById('notes-empty-state');
    const editor = document.getElementById('notes-editor');
    if (editor) editor.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';

    applyNotePageColor(null);
    setMobileNotesView('list'); // no-op on desktop; on phone, nothing left to show in the detail pane
    renderNotesList();
}

// Belt-and-suspenders: if the tab is closed/refreshed while an autosave
// is still pending (within the 500ms debounce window), flush it so the
// last few keystrokes aren't lost.
window.addEventListener('beforeunload', flushNoteSave);

// --- SUPABASE AUTH & DATA SYNC ---

let currentUser = null;
let currentAccessToken = null; // kept in sync in handleAuthSession - needed synchronously by emergencySaveOnExit below, which can't await an async getSession() call during page unload
let isLoadingCloudData = false; // guards against re-uploading data while we're mid-download
let cloudSyncTimer = null;
let lastLocalSaveAt = 0; // Date.now() of our own last successful cloud save - used to ignore the realtime echo of our own writes, see subscribeToRealtimeSync() below
let realtimeChannel = null;

// Bundles everything worth syncing into one payload for the `app_data` column.
function buildSyncPayload() {
    return { timeData, backlogItems, categoryGoals, customCategoryColors, notesData, notesNotebooks, trashedItems, manualCategories, hiddenCategories };
}

// Debounced cloud save — called from every existing local save function so
// nothing new has to remember to sync; it just piggybacks on saves that
// already happen. `immediate` skips the debounce (used for the one-time
// "upload my existing device data" migration).
function queueCloudSync(immediate) {
    if (!currentUser || isLoadingCloudData || sessionOverridden) return;

    if (immediate) {
        clearTimeout(cloudSyncTimer);
        cloudSyncTimer = null;
        return saveUserData(currentUser.id, buildSyncPayload());
    }

    clearTimeout(cloudSyncTimer);
    cloudSyncTimer = setTimeout(() => {
        cloudSyncTimer = null;
        saveUserData(currentUser.id, buildSyncPayload());
    }, 1000);
}

// Forces any pending debounced cloud save to happen right now instead of
// waiting out its timer. This matters a lot on phones: switching apps,
// locking the screen, or closing the tab commonly freezes JS timers
// immediately, so a normal setTimeout-based save can simply never fire -
// which is exactly what looked like "changes on my phone never reach my
// desktop." Called from visibilitychange/pagehide below.
function flushCloudSync() {
    if (cloudSyncTimer) {
        queueCloudSync(true);
    }
}

// A save built specifically to survive the page actually closing/
// refreshing, unlike flushCloudSync above. The normal save path
// (saveUserData -> supabase-js's .upsert(), a plain fetch()) routinely
// gets aborted by the browser the instant navigation/unload starts -
// most browsers don't wait for in-flight requests once a page starts
// closing. That's the real explanation for "sometimes it doesn't save
// unless I press the manual Save button" and "refreshing loses the last
// change": the debounced autosave was still in flight (or hadn't even
// started yet) at the exact moment of refresh/close, and got cut off
// with no error and no chance to retry.
//
// `keepalive: true` is the browser API built exactly for this - it
// tells the browser to let this specific request finish even after the
// page starts unloading. It comes with a small trade-off (browsers cap
// keepalive request bodies around 64KB), so this fires ALONGSIDE the
// normal flush below, not instead of it: on a fast connection the
// normal save usually still wins the race and this becomes a no-op
// duplicate (harmless), and on a slow one or a large payload over the
// cap, at least one of the two has a real shot at landing instead of
// neither.
function emergencySaveOnExit() {
    // CRITICAL: must match queueCloudSync's guard exactly. The app starts
    // blank locally and only fills in with real data once the cloud
    // fetch finishes (isLoadingCloudData tracks that window) - firing a
    // save before that finishes would upload the still-blank local state
    // and overwrite the real data in the cloud with emptiness. This
    // check was missing here (present in queueCloudSync, not here) and
    // is exactly the kind of bug that causes "I logged in and all my
    // data is gone."
    if (!currentUser || !currentAccessToken || isLoadingCloudData || sessionOverridden) return;
    try {
        const body = JSON.stringify([{ user_id: currentUser.id, app_data: buildSyncPayload() }]);
        fetch(`${SUPABASE_URL}/rest/v1/user_data?on_conflict=user_id`, {
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${currentAccessToken}`,
                'Prefer': 'resolution=merge-duplicates'
            },
            body
        }).catch(() => {}); // best-effort - nothing more useful to do with an error during unload
    } catch (err) {
        // e.g. payload over the keepalive size cap - non-fatal, the
        // normal flushCloudSync() call alongside this is still in play.
        console.error('Emergency exit save could not be started (non-fatal):', err.message || err);
    }
}

function updateAuthUI(user) {
    const label = document.getElementById('auth-btn-label');
    const guestView = document.getElementById('auth-guest-view');
    const userView = document.getElementById('auth-user-view');
    const userEmail = document.getElementById('auth-user-email');
    const avatar = document.getElementById('user-avatar-circle');

    if (user) {
        if (label) label.innerText = 'Synced';
        if (guestView) guestView.style.display = 'none';
        if (userView) userView.style.display = 'block';
        if (userEmail) userEmail.innerText = user.email;
        if (avatar) {
            avatar.innerText = (user.email || '?').trim().charAt(0).toUpperCase();
            avatar.classList.add('logged-in');
        }
    } else {
        if (label) label.innerText = 'Account';
        if (guestView) guestView.style.display = 'block';
        if (userView) userView.style.display = 'none';
        if (avatar) avatar.classList.remove('logged-in');
    }
}

// Runs whenever Supabase reports a login, logout, or an existing session
// being restored on page load.
async function handleAuthSession(session) {
    currentUser = session ? session.user : null;
    currentAccessToken = session ? session.access_token : null;
    updateAuthUI(currentUser);
    if (!currentUser) {
        unsubscribeFromRealtimeSync();
        return;
    }

    isLoadingCloudData = true;
    const cloudData = await loadUserData(currentUser.id);

    if (cloudData) {
        // This account already has cloud data — it takes over on this device.
        applyCloudSnapshot(cloudData);
    } else {
        // First time this account has ever logged in anywhere — offer to
        // upload whatever's already on this device instead of starting empty.
        const hasLocalData = Object.keys(timeData).length > 0 || backlogItems.length > 0 || notesData.length > 0;
        if (hasLocalData && await showConfirmDialog('We found existing activity data on this device. Upload it to your new account?', { confirmLabel: 'Upload', danger: false })) {
            isLoadingCloudData = false;
            await queueCloudSync(true);
            isLoadingCloudData = true;
        }
    }

    isLoadingCloudData = false;
    subscribeToRealtimeSync();
    claimActiveSession();
}

// --- SINGLE ACTIVE SESSION (WhatsApp-Web style) ---
// Without this, opening the account in two tabs/devices at once is
// dangerous in a very specific way: an old/stale tab that hasn't pulled
// recent changes can still save, and that save wins - silently
// overwriting whatever the OTHER, more current tab had. This closes
// that gap the same way WhatsApp Web does: only one tab is ever the
// "active" one. Opening a new one takes over immediately, and the tab
// that just got displaced is locked out of saving until it explicitly
// says "use here" - so a stale tab can never silently clobber a
// fresher one again.
//
// Piggybacks on the existing Realtime subscription already watching
// this account's user_data row (see subscribeToRealtimeSync below)
// rather than a second channel/table - active_session_id is just
// another column on that same row, so an ordinary update to your real
// data doesn't touch it, and claiming a session doesn't touch your real
// data either.
let mySessionId = null;
let sessionOverridden = false; // true once another tab has taken over - blocks this tab from saving until "Use here instead" is clicked

function generateSessionId() {
    return (crypto.randomUUID ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2)));
}

// Claims this tab as the one active session for the account. Called on
// every login/page load (last-opened tab always wins, same as WhatsApp
// Web) and again if you click "Use here instead" after being displaced.
//
// REQUIRES this one-time SQL (Supabase dashboard -> SQL Editor):
//   alter table user_data add column if not exists active_session_id text;
async function claimActiveSession() {
    if (!currentUser) return;
    mySessionId = generateSessionId();
    sessionOverridden = false;
    hideSessionTakeoverOverlay();
    lastLocalSaveAt = Date.now(); // reuses the existing "ignore the echo of our own write" window in the Realtime handler below, so claiming doesn't trigger a needless self-pull
    try {
        await supabaseClient.from('user_data').update({ active_session_id: mySessionId }).eq('user_id', currentUser.id);
    } catch (err) {
        // Almost certainly means the active_session_id column doesn't
        // exist yet (see the SQL above) - fails safe: this tab just
        // won't enforce single-session locking rather than breaking
        // anything else.
        console.error('Could not claim active session (non-fatal - is the active_session_id column set up?):', err);
    }
}

function showSessionTakeoverOverlay() {
    sessionOverridden = true;
    const overlay = document.getElementById('session-takeover-overlay');
    if (overlay) overlay.classList.add('visible');
}

function hideSessionTakeoverOverlay() {
    const overlay = document.getElementById('session-takeover-overlay');
    if (overlay) overlay.classList.remove('visible');
}

// "Use here instead" - reclaims the session (displacing whatever tab
// currently holds it) and pulls the truly latest data first, since this
// tab may have been sitting locked-out and stale for a while.
async function useSessionHere() {
    await claimActiveSession();
    await pullLatestCloudData();
    showSaveToast("You're active here now", false);
    setTimeout(() => showSaveToast('', false), 2000);
}

// --- CROSS-DEVICE PUSH SYNC ---
// Without this, one device only ever learns about another device's
// changes when IT does something (tab regains focus, etc.) - so a save
// on the phone could sit there until the desktop tab happened to be
// touched again. This subscribes to Supabase Realtime for this account's
// own row in `user_data`, so the moment any device saves, every other
// open, logged-in tab hears about it within roughly a second and pulls
// it in automatically via the same safe pullLatestCloudData() path used
// for tab-focus resync (which flushes any local pending edits first, so
// it doesn't stomp on something being actively typed on THIS device).
//
// NOTE: this requires Realtime to be turned on for the `user_data` table
// in the Supabase project (Database → Replication) - it's a project
// setting, not something this code can turn on by itself. Without it,
// nothing breaks; devices simply fall back to syncing on tab focus/save,
// same as before.
function subscribeToRealtimeSync() {
    if (!currentUser) return;
    unsubscribeFromRealtimeSync();

    realtimeChannel = supabaseClient
        .channel('user_data_sync_' + currentUser.id)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_data',
            filter: `user_id=eq.${currentUser.id}`
        }, (payload) => {
            const newRow = payload.new || {};

            // Another tab/device just claimed the active session (opened
            // fresh, or clicked "Use here instead") - this tab is now the
            // stale one. Show the takeover overlay instead of pulling
            // data normally; showSessionTakeoverOverlay() also sets
            // sessionOverridden, which blocks this tab from saving until
            // it explicitly reclaims via useSessionHere().
            if (mySessionId && newRow.active_session_id && newRow.active_session_id !== mySessionId) {
                showSessionTakeoverOverlay();
                return;
            }

            // Ignore the echo of our OWN save landing back through
            // Realtime a moment later - otherwise every save would
            // immediately re-trigger a redundant fetch of the data we
            // just wrote.
            if (Date.now() - lastLocalSaveAt < 2000) return;
            pullLatestCloudData();
        })
        .subscribe();
}

function unsubscribeFromRealtimeSync() {
    if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
        realtimeChannel = null;
    }
}

// Overwrites in-memory + local state with a cloud snapshot and re-renders
// everything. Shared by the initial login/page-load path and by
// pullLatestCloudData (tab-resume re-sync) below.
function applyCloudSnapshot(cloudData) {
    timeData = cloudData.timeData || {};
    backlogItems = cloudData.backlogItems || [];
    categoryGoals = cloudData.categoryGoals || {};
    customCategoryColors = cloudData.customCategoryColors || {};
    notesData = cloudData.notesData || [];
    notesNotebooks = cloudData.notesNotebooks || [];
    trashedItems = cloudData.trashedItems || [];
    // manualCategories previously only lived in localStorage (this is
    // the first version that syncs it to the cloud too) - merge rather
    // than overwrite, so anyone who already added categories locally
    // before this update doesn't lose them the moment cloud data (which
    // won't have them yet) loads in.
    const localManualCategories = JSON.parse(localStorage.getItem('manualCategories') || '[]');
    manualCategories = [...new Set([...localManualCategories, ...(cloudData.manualCategories || [])])];
    hiddenCategories = cloudData.hiddenCategories || [];

    localStorage.setItem('flexibleTimeData', JSON.stringify(timeData));
    localStorage.setItem('backlogItems', JSON.stringify(backlogItems));
    localStorage.setItem('categoryGoals', JSON.stringify(categoryGoals));
    localStorage.setItem('customCategoryColors', JSON.stringify(customCategoryColors));
    localStorage.setItem('notesData', JSON.stringify(notesData));
    localStorage.setItem('notesNotebooks', JSON.stringify(notesNotebooks));
    localStorage.setItem('trashedItems', JSON.stringify(trashedItems));
    localStorage.setItem('manualCategories', JSON.stringify(manualCategories));
    localStorage.setItem('hiddenCategories', JSON.stringify(hiddenCategories));

    purgeExpiredTrash(); // quietly cleans out anything past the 30-day window, and its media, on every fresh load

    refreshApp();
    renderNotebookSelector();

    // If a note is open, re-populate it from the fresh copy instead of
    // just closing it - selectNote() re-reads title/blocks/category from
    // the (possibly now-different) note object. If it was deleted on the
    // other device, fall back to the empty state instead of erroring.
    if (currentNoteId) {
        const stillExists = notesData.some(n => n.id === currentNoteId);
        if (stillExists) {
            selectNote(currentNoteId);
        } else {
            currentNoteId = null;
            const emptyState = document.getElementById('notes-empty-state');
            const editor = document.getElementById('notes-editor');
            if (emptyState) emptyState.style.display = 'flex';
            if (editor) editor.style.display = 'none';
            renderNotesList();
        }
    }
}

// Re-syncs with the cloud whenever the tab regains focus/visibility -
// coming back from another app, unlocking the phone, alt-tabbing back.
// Pending edits are flushed FIRST so nothing local gets clobbered, then
// the latest cloud copy is pulled in - this is what makes an edit made on
// one device show up on another without a manual refresh, and it's the
// counterpart to the flush-on-hide handlers below.
async function pullLatestCloudData() {
    if (!currentUser || isLoadingCloudData) return;

    flushNoteSave();
    flushCloudSync();

    isLoadingCloudData = true;
    try {
        const cloudData = await loadUserData(currentUser.id);
        if (cloudData) applyCloudSnapshot(cloudData);
    } finally {
        isLoadingCloudData = false;
    }
}

// Phones commonly freeze JS timers the instant a tab is backgrounded, so a
// setTimeout-based debounce (note autosave, cloud sync) can simply never
// fire if the user switches apps or locks the screen right after typing -
// which is exactly what looked like "changes on my phone never reach my
// desktop." visibilitychange fires synchronously before that freeze, so
// flushing here is far more reliable than beforeunload alone (which mobile
// browsers barely fire for app-switch/home-button cases).
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        flushNoteSave();
        flushCloudSync();
        emergencySaveOnExit();
        releaseNoteRecordingStreamForGood(); // don't leave the mic open while the tab is backgrounded
    } else if (document.visibilityState === 'visible') {
        pullLatestCloudData();
    }
});
window.addEventListener('pagehide', () => {
    flushNoteSave();
    flushCloudSync();
    emergencySaveOnExit();
});

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    const errorEl = document.getElementById('auth-error-msg');
    if (errorEl) errorEl.style.display = 'none';
    if (modal) modal.style.display = 'block';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'none';
}

function showAuthError(message) {
    const el = document.getElementById('auth-error-msg');
    if (!el) return;
    el.innerText = message;
    el.style.display = 'block';
}

async function handleLoginClick() {
    const email = document.getElementById('auth-email-input').value.trim();
    const password = document.getElementById('auth-password-input').value;
    if (!email || !password) return showAuthError('Enter both email and password.');

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return showAuthError(error.message);

    closeAuthModal();
}

async function handleSignUpClick() {
    const email = document.getElementById('auth-email-input').value.trim();
    const password = document.getElementById('auth-password-input').value;
    if (!email || !password) return showAuthError('Enter both email and password.');
    if (password.length < 6) return showAuthError('Password must be at least 6 characters.');

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return showAuthError(error.message);

    if (data.session) {
        closeAuthModal();
    } else {
        showAuthError('Account created — check your email to confirm it, then log in.');
    }
}

async function logOutUser() {
    await supabaseClient.auth.signOut();
    unsubscribeFromRealtimeSync();

    // Wipe what's showing on THIS device — otherwise the previous account's
    // activities would stay visible to whoever uses this browser/computer next.
    // (Nothing is lost: it's already safely saved in their cloud account and
    // will reappear the next time they log back in, on any device.)
    currentUser = null;
    updateAuthUI(null);
    timeData = {};
    backlogItems = [];
    categoryGoals = {};
    customCategoryColors = {};
    notesData = [];
    notesNotebooks = [];
    activeNotebookFilter = '';
    notesUndoStack = [];
    notesRedoStack = [];
    trashedItems = [];
    mySessionId = null;
    sessionOverridden = false;
    hideSessionTakeoverOverlay();
    currentNoteId = null;

    localStorage.removeItem('flexibleTimeData');
    localStorage.removeItem('backlogItems');
    localStorage.removeItem('categoryGoals');
    localStorage.removeItem('customCategoryColors');
    localStorage.removeItem('notesData');
    localStorage.removeItem('notesNotebooks');
    localStorage.removeItem('activeNotebookFilter');

    // Reset the notes pane itself, not just the underlying data - otherwise
    // whatever note was open stays visible on screen until something else
    // triggers a re-render.
    renderNotebookSelector();
    renderNotesList();
    const notesEmptyState = document.getElementById('notes-empty-state');
    const notesEditor = document.getElementById('notes-editor');
    if (notesEmptyState) notesEmptyState.style.display = 'flex';
    if (notesEditor) notesEditor.style.display = 'none';

    closeAuthModal();
    refreshApp();
}

// Load user data from Supabase table
async function loadUserData(userId) {
  const { data, error } = await supabaseClient
    .from('user_data')
    .select('app_data')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') console.error("Fetch error:", error.message);
  return data ? data.app_data : null;
}

// Save or sync user data to Supabase table
async function saveUserData(userId, payload) {
  const { data, error } = await supabaseClient
    .from('user_data')
    .upsert(
      { user_id: userId, app_data: payload },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error("Sync error:", error.message);
    // Previously only the manual Save button surfaced a failure - the
    // silent background autosave (the normal path for almost every
    // edit) gave zero indication when it failed, so a real problem
    // (network blip, expired session, etc.) was only ever discovered
    // by manually pressing Save later, or worse, not until the change
    // was already gone. Now any failed save says so, the same way,
    // regardless of what triggered it.
    showSaveToast('⚠️ Could not save - check your connection', false);
  } else {
    lastLocalSaveAt = Date.now();
    maybeAutoBackupToDropbox();
  }
  return { data, error };
}

// --- NOTE MEDIA STORAGE (Supabase Storage) ---
// Photos and voice notes used to be embedded as base64 text directly
// inside a note's `blocks` array - simple to write, but that base64
// rides along on EVERY save: into localStorage (a few MB quota on most
// phones, which is exactly what "Storage is full" further up in this
// file is about), and into the cloud sync payload (the Postgres
// `app_data` column - the 500MB database, not the 1GB file storage
// Supabase actually provides for exactly this). A user with well under
// 20 photos can fill localStorage this way. This section moves the
// actual files to a Storage bucket instead, so a note only ever carries
// a short URL (plus the storage path, so it can be cleaned up on
// delete) - see uploadNoteMediaBlob below, and migrateBase64MediaToStorage
// further down for pulling existing base64 photos/voice notes out of
// old notes automatically.
//
// REQUIRES a Storage bucket named 'note-media' to exist in this
// Supabase project (Storage -> New bucket -> name it exactly
// "note-media" -> Public bucket: on), plus RLS policies letting a
// logged-in user read/write/delete only their own folder inside it.
const NOTE_MEDIA_BUCKET = 'note-media';

// Guests (no account) have nowhere to upload to - callers fall back to
// the old base64-in-place behavior when this is false.
function canUseCloudMediaStorage() {
    return !!currentUser;
}

// Uploads a Blob to this user's own folder in the bucket and returns
// { url, path } - or null if it couldn't (no account, offline, bucket
// missing/misconfigured), so callers can fall back to storing the photo
// or recording locally instead of losing it outright.
async function uploadNoteMediaBlob(blob, ext) {
    if (!canUseCloudMediaStorage()) return { url: null, path: null, error: null }; // guest - not an error, just nowhere to upload to
    const path = `${currentUser.id}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    try {
        const { error } = await supabaseClient.storage
            .from(NOTE_MEDIA_BUCKET)
            .upload(path, blob, { contentType: blob.type || undefined, upsert: false });
        if (error) throw error;
        const { data } = supabaseClient.storage.from(NOTE_MEDIA_BUCKET).getPublicUrl(path);
        return { url: data.publicUrl, path, error: null };
    } catch (err) {
        const message = err?.message || err?.error_description || String(err);
        console.error('Media upload failed, falling back to local storage for this item:', message);
        return { url: null, path: null, error: message };
    }
}

// Fire-and-forget delete of a stored file - called whenever a photo or
// voice-note block (or a whole note containing one) is deleted, so
// removed media doesn't just sit in the bucket forever burning through
// the 1GB quota for files nobody can even see anymore.
function deleteNoteMediaPath(path) {
    if (!path) return;
    supabaseClient.storage.from(NOTE_MEDIA_BUCKET).remove([path]).catch(err => {
        console.error('Could not delete stored media (non-fatal, safe to ignore):', err.message || err);
    });
}

// Reads a Blob into a base64 data URL - the guest/offline fallback path
// for photos and voice notes (same format they were always stored in
// before Storage existed).
function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read that file.'));
        reader.readAsDataURL(blob);
    });
}

// --- MANUAL SAVE (Save button + Ctrl/Cmd+S) ---
// The debounced autosave (queueCloudSync) already runs constantly in the
// background, but it's invisible - there was no way to actually know
// "yes, everything is saved right now." This gives a direct, on-demand
// save with visible confirmation: flushes any pending note edit and any
// pending debounced cloud sync immediately (skipping their timers
// entirely) and shows a toast once it's actually landed in the cloud.
let manualSaveInFlight = false;
async function manualSave() {
    if (manualSaveInFlight) return;

    if (!currentUser) {
        showSaveToast('Log in to save your data', false);
        openAuthModal();
        return;
    }

    if (isLoadingCloudData) {
        // Your real data is still being fetched from the cloud - saving
        // right now would upload the still-loading (effectively blank)
        // local state and overwrite it. In practice the loading overlay
        // blocks this button from even being clickable during this
        // window, but this guard matches queueCloudSync/emergencySaveOnExit
        // for safety regardless.
        return;
    }

    if (sessionOverridden) {
        // This tab has been displaced by a newer one elsewhere - saving
        // from here would risk overwriting whatever that tab has done
        // since. showSessionTakeoverOverlay() already put up the "active
        // elsewhere" screen; this is just the save-button-specific echo
        // of the same protection.
        showSaveToast('This tab is no longer active - see the notice on screen', false);
        setTimeout(() => showSaveToast('', false), 2500);
        return;
    }

    manualSaveInFlight = true;
    showSaveToast('Saving…', true);

    flushNoteSave();
    clearTimeout(cloudSyncTimer);
    cloudSyncTimer = null;

    const { error } = await saveUserData(currentUser.id, buildSyncPayload());

    manualSaveInFlight = false;
    if (!error) {
        showSaveToast('Saved ✓', false);
    }
    // On error, saveUserData() already showed the failure toast.
}

let saveToastHideTimer = null;
function showSaveToast(message, sticky) {
    const toast = document.getElementById('save-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');

    clearTimeout(saveToastHideTimer);
    if (!sticky) {
        saveToastHideTimer = setTimeout(() => {
            toast.classList.remove('visible');
        }, 2200);
    }
}

// Ctrl+S / Cmd+S triggers the same manual save instead of the browser's
// own "Save Page As…" dialog. Explicitly excludes Shift so this doesn't
// also fire (alongside the Dropbox shortcut below) when Ctrl+Shift+S is
// pressed - without this check both used to trigger together, with two
// save toasts competing on screen.
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        manualSave();
    }
});

// Ctrl+Shift+S / Cmd+Shift+S triggers an immediate Dropbox backup - kept
// as a distinct shortcut from plain Ctrl+S (which saves to the Supabase
// account, not Dropbox) so the two don't get confused with each other.
// Does nothing if Dropbox isn't linked yet - backupNowToDropbox() already
// handles that case with its own clear toast message.
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!getDropboxRefreshToken()) {
            showSaveToast('Link Dropbox first (see the backup section)', false);
            setTimeout(() => showSaveToast('', false), 2500);
            return;
        }
        backupNowToDropbox();
    }
});

// --- PINCH-ZOOM / DOUBLE-TAP-ZOOM PREVENTION (mobile "app feel") ---
// This used to be handled by `touch-action: manipulation` on html/body in
// the CSS. That worked for blocking zoom, but had a nasty side effect on
// iOS Safari: declaring touch-action anywhere near the top of the page
// can suppress horizontal touch-scrolling for elements nested inside it,
// even ones with their own explicit "allow sideways scrolling" rule -
// which is exactly what was silently breaking left/right dragging on the
// big weekly calendar. This gets the same "can't pinch or double-tap to
// zoom" app-like feel a different way, without setting touch-action at
// that top level at all, so it can no longer interfere with anything
// further down the tree.
document.addEventListener('gesturestart', (e) => e.preventDefault()); // Safari's pinch-zoom gesture

let lastGlobalTouchEndTime = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastGlobalTouchEndTime < 300) {
        e.preventDefault(); // a quick double-tap anywhere - block the zoom, not the tap itself
    }
    lastGlobalTouchEndTime = now;
}, { passive: false });

// --- BIG CALENDAR: mouse drag-to-scroll (desktop/DevTools) ---
// Real touch input on the calendar is now left entirely to the browser's
// own native scrolling (see the CSS - no touch-action restriction on
// .visual-matrix-container, same as it already works at tablet/desktop
// widths, complete with the native scrollbar). Earlier attempts here
// tried to take touch scrolling over with custom JS because native
// scrolling seemed unreliable on phones - but the same container, same
// overflow-x:auto, works fine natively at wider viewports, which means
// it was never the browser that was the problem. This is now scoped to
// mouse input only (pointerType === 'mouse'), purely so a plain mouse
// drag also scrolls the calendar - handy for testing in DevTools and for
// anyone using the app with a mouse/trackpad on desktop. Real touch
// pointers are ignored here on purpose so this never competes with the
// native touch-scrolling handling them.
//
// - A gesture starting on a .visual-block or its resize-handle is left
//   alone entirely so this never fights with dragging or resizing a
//   block.
// - The first ~6px of movement decides the gesture's direction once;
//   horizontal takes over scrollLeft, vertical is left alone.
// - setPointerCapture keeps the drag tracking even if the cursor moves
//   outside the container's box mid-drag.
// - Attached once, directly on the static .visual-matrix-container
//   element in the HTML (not inside renderVisualMatrix, which reruns on
//   every refresh and would otherwise stack duplicate listeners).
function setupBigCalendarHorizontalScroll() {
    const container = document.querySelector('.visual-matrix-container');
    if (!container) return;

    let activePointerId = null;
    let isDown = false;
    let startX = 0, startY = 0, startScrollLeft = 0;
    let direction = null; // 'x' | 'y' | null (undecided for this gesture)
    const DIRECTION_LOCK_PX = 6;

    const endGesture = () => {
        if (direction === 'x') container.classList.remove('matrix-drag-scrolling');
        isDown = false;
        activePointerId = null;
        direction = null;
    };

    container.addEventListener('pointerdown', (e) => {
        // Mouse only - real touch/pen input is left to the browser's own
        // native scrolling (see CSS comment above).
        if (e.pointerType !== 'mouse') return;
        if (calendarBlockGestureActive) return;
        // A block or its resize handle owns its own drag/resize gesture -
        // don't also start a scroll attempt on top of it.
        if (e.target.closest('.visual-block') || e.target.closest('.resize-handle')) return;
        // Only the primary mouse button initiates a drag-scroll; right
        // click / middle click should behave normally.
        if (e.button !== 0) return;

        isDown = true;
        activePointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        startScrollLeft = container.scrollLeft;
        direction = null;
    });

    container.addEventListener('pointermove', (e) => {
        if (!isDown || e.pointerId !== activePointerId) return;
        if (calendarBlockGestureActive) { endGesture(); return; }

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!direction) {
            if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;
            direction = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
            if (direction === 'x') {
                // Capture so we keep receiving pointermove even if the
                // cursor/finger drifts outside the container mid-drag.
                try { container.setPointerCapture(activePointerId); } catch (_) {}
                container.classList.add('matrix-drag-scrolling');
            }
        }

        if (direction === 'x') {
            // Manually driving scrollLeft - stop the browser from also
            // trying to interpret this as text selection, a page
            // bounce/refresh gesture, or its own native panning.
            e.preventDefault();
            container.scrollLeft = startScrollLeft - dx;
        }
        // direction === 'y': don't touch anything, don't preventDefault -
        // vertical passes straight through and scrolls the page normally.
    });

    container.addEventListener('pointerup', endGesture);
    container.addEventListener('pointercancel', endGesture);
}
setupBigCalendarHorizontalScroll();

// --- ONE-TIME MIGRATION: base64 photos/voice notes -> Storage ---
// Notes saved before uploadNoteMediaBlob existed still have their
// photos/voice notes sitting as raw base64 data: URLs right inside
// notesData - which is exactly what fills up localStorage's few-MB
// quota after well under 20 photos, throwing "Storage is full" on every
// further edit. This pulls every such block out to the Storage bucket
// in the background, the same way a brand new photo/recording is
// handled now, and swaps in the resulting URL - so existing notes get
// the same fix retroactively instead of only new ones. Runs once after
// boot, only for logged-in users (guests have nowhere to upload to),
// and saves once at the end rather than after every single block so it
// doesn't spam the cloud sync mid-migration.
let mediaMigrationRunning = false;
async function migrateBase64MediaToStorage() {
    if (!currentUser || mediaMigrationRunning) return;

    const pending = [];
    notesData.forEach(note => {
        ensureNoteBlocks(note);
        note.blocks.forEach(block => {
            if (block.type !== 'image' && block.type !== 'audio') return;
            const field = block.type === 'image' ? 'imageData' : 'audioData';
            const value = block[field];
            if (typeof value === 'string' && value.startsWith('data:') && !block.storagePath) {
                pending.push(block);
            }
        });
    });
    if (!pending.length) return;

    mediaMigrationRunning = true;
    let migratedCount = 0;
    for (const block of pending) {
        try {
            const field = block.type === 'image' ? 'imageData' : 'audioData';
            const dataUrl = block[field];
            const blob = await (await fetch(dataUrl)).blob();
            const ext = block.type === 'image'
                ? 'jpg'
                : (blob.type.indexOf('mp4') !== -1 ? 'm4a' : 'webm');
            const uploaded = await uploadNoteMediaBlob(blob, ext);
            if (uploaded.url) {
                block[field] = uploaded.url;
                block.storagePath = uploaded.path;
                migratedCount++;
            }
            // If upload failed, the block is just left as base64 for
            // now - it'll be retried next boot.
        } catch (err) {
            console.error('Could not migrate a media block to Storage (left as-is, will retry next load):', err.message || err);
        }
    }
    mediaMigrationRunning = false;

    if (migratedCount > 0) {
        const openNote = notesData.find(n => n.id === currentNoteId);
        if (openNote) renderNoteBlocks(openNote);
        saveNotesData(); // both localStorage and the cloud stop carrying the old base64 copies
    } else if (pending.length > 0) {
        // Found old photos/voice notes to migrate but couldn't upload a
        // single one - almost always means the 'note-media' bucket
        // doesn't exist yet, or its RLS policies are missing/wrong.
        // Surfacing this clearly is the whole point: without it, this
        // fails silently forever and the only symptom is the mystery
        // "Storage is full" message coming back.
        setVoiceStatus(`⚠️ ${pending.length} older photo${pending.length > 1 ? 's/voice notes' : '/voice note'} couldn't move to cloud storage - check the note-media bucket setup in Supabase.`);
        setTimeout(() => setVoiceStatus(''), 6000);
    }
}

// Boots the app exactly once with whatever session state won the race
// below - loads the cloud data (if any), renders everything, then
// reveals the page.
async function bootAppWithSession(session) {
    if (didInitialBoot) return;
    didInitialBoot = true;

    try {
        await handleAuthSession(session);
        refreshApp();
        applyTranslations(); // re-paint the just-loaded dynamic content (calendar, notes, Kanban) in the current language
        refreshCardStartTimeSuggestion(); // real data just loaded - make sure the suggested Start Time reflects it, not the pre-load default
        renderNotebookSelector();
        initBacklogPanel();
        updateDropboxUI();
        renderTrashModal(); // just to sync the header badge count - the modal itself stays hidden
        if (pendingFirstDropboxBackup) {
            // Real data has now actually loaded (we're past
            // handleAuthSession above) - safe to take the first backup
            // now, bypassing the normal 15-minute rate limit just this
            // once so linking Dropbox doesn't feel like it silently did
            // nothing.
            pendingFirstDropboxBackup = false;
            backupNowToDropbox();
        }
        migrateBase64MediaToStorage();
        // Real data (or its confirmed absence, for a genuine first-time
        // guest) has now actually loaded - safe to decide whether this
        // is a fresh install that should see the walkthrough.
        maybeAutoStartWalkthrough();
    } catch (err) {
        // Whatever just went wrong (a bad data shape, a Supabase hiccup,
        // anything) - without this, an error here used to leave the
        // whole page stuck behind the loading overlay forever with zero
        // indication why, since nothing after the failing line ever ran,
        // including the code that hides the overlay. That's the worst
        // possible failure mode for a page load, so no matter what
        // breaks above, the overlay below is now guaranteed to still
        // come down, and the actual error is now visible instead of
        // silently swallowed as an uncaught promise rejection.
        console.error('Error during app boot:', err);
        showBootErrorBanner(err);
    }

    const overlay = document.getElementById('initial-load-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// Shown only if bootAppWithSession above actually caught something - a
// dismissible banner explaining the app may be showing incomplete data,
// with the real error underneath for anyone who needs to report it
// (visible in place of a silent infinite spinner, which gave no way to
// even know something had gone wrong, let alone what).
function showBootErrorBanner(err) {
    const existing = document.getElementById('boot-error-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'boot-error-banner';
    banner.className = 'boot-error-banner';
    banner.innerHTML = `
        <div class="boot-error-banner-text">
            ⚠️ Something went wrong loading your data. The app may be showing incomplete or empty information - try refreshing. If this keeps happening, screenshot this message.
            <div class="boot-error-banner-detail">${escapeHtml(err && err.message ? err.message : String(err))}</div>
        </div>
        <button type="button" class="boot-error-banner-close" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(banner);
}


// Two independent paths race to boot the app - didInitialBoot above
// guarantees only the winner actually runs it, so running both is safe:
//
// 1) getSession() explicitly asks "what's the session RIGHT NOW" - this
//    is the purpose-built way to check current auth state on load, and
//    the more reliable of the two in practice.
// 2) onAuthStateChange's first callback is SUPPOSED to carry the same
//    restored session, but its exact timing relative to the session
//    finishing its restore from storage isn't always consistent -
//    occasionally it can fire as if logged out for a moment before
//    correcting itself. Previously that alone decided the very first
//    paint: a mistimed null session rendered a genuinely blank page,
//    and nothing was watching for the correction to trigger a re-render
//    - so the page just sat blank until something else (like clicking a
//    date on the mini calendar) happened to call refreshApp() again and
//    the real data finally appeared. Kept here now purely as a fallback
//    in case getSession() is ever slower or fails outright, not as the
//    thing actually deciding what gets painted first.
let didInitialBoot = false;
supabaseClient.auth.getSession().then(({ data }) => {
    bootAppWithSession(data.session);
}).catch((err) => {
    // getSession() itself failed outright (not just slow) - boot as a
    // guest rather than waiting out the 6-second safety net below for
    // no reason when we already know this path won't recover on its own.
    console.error('getSession() failed:', err);
    bootAppWithSession(null);
});

supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (!didInitialBoot) {
        bootAppWithSession(session);
        return;
    }
    // Boot already happened - this is a real subsequent change (login,
    // logout, token refresh). handleAuthSession() re-renders via
    // applyCloudSnapshot() whenever there's data to show.
    handleAuthSession(session);
});

// Safety net: if Supabase never calls back at all (offline, a blocked
// request, or literally any other reason both paths above never fired)
// the page would otherwise be stuck behind the loading overlay forever.
// Routes through the same protected bootAppWithSession as everything
// else above, rather than duplicating the render/overlay-hide steps
// unprotected here too.
setTimeout(() => {
    bootAppWithSession(null);
}, 6000);

// Restore the collapsed/expanded state of the filters + category legend
// panel above the big calendar from last time (defaults to collapsed).
(function initPlannerHeaderState() {
    const panel = document.getElementById('planner-header-collapsible');
    const btn = document.getElementById('planner-header-toggle-btn');
    if (!panel) return;
    const wasExpanded = localStorage.getItem('plannerHeaderExpanded') === '1';
    if (wasExpanded) {
        panel.classList.add('expanded');
        if (btn) btn.classList.add('open');
    }
})();

// --- MOBILE: horizontal scroll on the big calendar ---
// The grid only ever renders one week's worth of day columns, and on a
// phone those don't all fit - so the calendar container scrolls
// natively (overflow-x: auto + touch-action: pan-x, in the CSS): put a
// finger down anywhere inside it and drag, and the browser's own
// built-in touch-scrolling moves it left/right, same as scrolling any
// other content up/down. A custom JS-driven version of this was tried
// here at one point (manually tracking touch position and setting
// scrollLeft) but proved less reliable across real phones than just
// letting the browser handle it, so it's been removed in favor of plain
// native scrolling. Since the grid is only ever one week wide, dragging
// past the last visible day simply stops at that edge - it never bleeds
// into another week on its own. To actually change weeks, use the
// ◀ Week / Week ▶ buttons below the calendar (shiftPlannerWeek), same
// as on desktop.

// NOTE: the initial initBacklogPanel()/refreshApp()/renderNotebookSelector()
// call used to happen unconditionally right here on every script load.
// It's now handled inside the onAuthStateChange bootstrap above instead,
// so a logged-in user's first paint already has their real cloud data in
// it instead of a flash of empty state - see the comment there.
// --- MOBILE BOTTOM NAV ---
// On phone-width screens the page stops being one long scroll and
// becomes a set of single-purpose tabs - Timer / Log / Plan / Stats /
// Notes - switched with a fixed bottom bar, like a native app. Every
// top-level section carries data-mobile-section="..." in the HTML;
// showing a tab just means hiding every OTHER section with that
// attribute and un-hiding the one that matches. Desktop/tablet widths
// are untouched - the nav bar stays hidden and nothing here changes
// what's visible.
const MOBILE_NAV_BREAKPOINT = '(max-width: 768px)';
const MOBILE_NAV_STORAGE_KEY = 'mobileActiveSection';
let currentMobileSection = localStorage.getItem(MOBILE_NAV_STORAGE_KEY) || 'log';

function isMobileNavViewport() {
    return window.matchMedia(MOBILE_NAV_BREAKPOINT).matches;
}

function setMobileSection(section) {
    const isTabSwitch = !!section && section !== currentMobileSection;
    // Leaving Notes for a different tab means genuinely done recording
    // for now - release the mic right away instead of waiting out the
    // idle timer, so the phone's "mic in use" indicator doesn't linger
    // once you've moved on to the calendar, Kanban, etc.
    if (isTabSwitch && currentMobileSection === 'notes' && section !== 'notes') {
        releaseNoteRecordingStreamForGood();
    }
    if (section) {
        currentMobileSection = section;
        localStorage.setItem(MOBILE_NAV_STORAGE_KEY, section);
    }
    if (!isMobileNavViewport()) return;

    document.querySelectorAll('[data-mobile-section]').forEach(el => {
        el.classList.toggle('mobile-section-hidden', el.dataset.mobileSection !== currentMobileSection);
    });
    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === currentMobileSection);
    });

    updateMobileHeaderVisibility();
    updateMobileNavGlassPosition();
    layoutTimerPageForMobile();
    updateGlobalUndoBtn();

    // Only jump to the top when the person actually tapped a different
    // tab - not on every call. Mobile browsers fire a `resize` event
    // whenever the address bar collapses/expands while scrolling,
    // which was calling this on every scroll and yanking the page back
    // to the top before it could settle at the bottom.
    if (isTabSwitch) window.scrollTo(0, 0);
}

// Locks the Timer page to exactly the remaining viewport space (screen
// height minus header minus bottom nav) with no page-level scroll -
// only .today-strip-grid inside it scrolls. Deliberately based on
// window.innerHeight (the actual viewport size) rather than any
// scroll-position-relative measurement like getBoundingClientRect,
// which is what made an earlier version of this kind of calculation
// unstable - viewport size only changes on a real resize/orientation
// change/address-bar collapse, not on every scroll.
function layoutTimerPageForMobile() {
    const wrap = document.getElementById('timer-page-flex-wrap');
    if (!wrap) return;

    const onTimerMobile = isMobileNavViewport() && currentMobileSection === 'timer';
    document.body.classList.toggle('timer-page-locked', onTimerMobile);

    if (!onTimerMobile) {
        wrap.style.height = '';
        return;
    }

    const header = document.querySelector('.header-container');
    const nav = document.getElementById('mobile-bottom-nav');
    const headerHeight = (header && !header.classList.contains('mobile-header-hidden')) ? header.getBoundingClientRect().height : 0;
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    const bodyStyles = getComputedStyle(document.body);
    const bodyPadding = parseFloat(bodyStyles.paddingTop) + parseFloat(bodyStyles.paddingBottom);

    const available = Math.floor(window.innerHeight - headerHeight - navHeight - bodyPadding - 16); // 16px breathing room
    if (available > 200) { // sanity floor
        wrap.style.height = `${available}px`;
    }

    // <details> elements are unreliable at propagating a flex-shrink
    // constraint down to their own content in some browser engines - so
    // rather than depend on that cascade working correctly, measure the
    // real remaining space directly and set the grid's height
    // explicitly. This is what actually makes "only the grid scrolls"
    // work reliably, regardless of how any given browser handles
    // <details> internally.
    const bottom = document.getElementById('timer-page-bottom');
    const grid = document.querySelector('#timer-page-bottom .today-strip-grid');
    const summary = document.querySelector('#timer-page-bottom .details-summary');
    const visibleLiveBar = [...document.querySelectorAll('#timer-page-bottom .live-timer-bar')].find(b => getComputedStyle(b).display !== 'none');
    if (bottom && grid) {
        const bottomRect = bottom.getBoundingClientRect();
        const summaryHeight = summary ? summary.getBoundingClientRect().height : 0;
        const liveBarHeight = visibleLiveBar ? visibleLiveBar.getBoundingClientRect().height + 10 : 0; // +10 for its own margin-bottom
        const contentPadding = 40; // .details-content's own top+bottom padding
        const gridAvailable = Math.floor(bottomRect.height - summaryHeight - liveBarHeight - contentPadding);
        if (gridAvailable > 100) {
            grid.style.height = `${gridAvailable}px`;
        }
    }
}
window.addEventListener('resize', () => { if (currentMobileSection === 'timer') layoutTimerPageForMobile(); });

// Slides the frosted-glass highlight (.mobile-nav-glass) to sit exactly
// behind whichever tab is currently active, by measuring that button's
// real position/width and moving the glass element there with a CSS
// transform - one shared element animating between positions, rather
// than a background color swap on each button (which wouldn't have any
// "sliding" motion to it at all).
// Slides the frosted-glass highlight (.mobile-nav-glass) to sit exactly
// behind whichever tab is currently active, by measuring that button's
// real position and moving the glass element there with a CSS
// transform - one shared element animating between positions, rather
// than a background color swap on each button.
//
// IMPORTANT for performance: width is set here but deliberately NOT
// included in the CSS transition (see .mobile-nav-glass), and only
// actually changes on first positioning or a real resize - never on a
// plain tab switch. All 6 tabs are equal width by design (flex: 1 in
// the nav), so there's never a real reason to re-animate it between
// switches. Combining a width transition with backdrop-filter (already
// one of the more expensive things a browser renders) was forcing a
// full layout recalculation on every frame of every tab switch, which
// is what was actually causing the visible lag - not the glass blur by
// itself. Tab switching now moves via transform alone, which the
// browser can composite on the GPU without touching layout at all.
function updateMobileNavGlassPosition() {
    const nav = document.getElementById('mobile-bottom-nav');
    const glass = document.getElementById('mobile-nav-glass');
    const activeBtn = document.querySelector('.mobile-tab-btn.active');
    if (!nav || !glass || !activeBtn) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offsetX = btnRect.left - navRect.left;

    // Only touches width if it's actually different from last time
    // (first call, or a real resize) - never on an ordinary tab switch,
    // so switching tabs is a pure, cheap transform animation.
    const targetWidth = `${btnRect.width}px`;
    if (glass.style.width !== targetWidth) glass.style.width = targetWidth;

    glass.style.transform = `translateX(${offsetX}px)`;
    glass.classList.add('positioned');
}
window.addEventListener('resize', () => { if (isMobileNavViewport()) updateMobileNavGlassPosition(); });

// On phone widths, the "Lodge Time Budgeter" title bar (Home / Account
// / Theme buttons) only shows on the Timer tab - everywhere else it was
// just eating space above content that's already switched by the tab
// bar. Desktop/tablet keeps it on every "page", unchanged - this class
// only has any effect inside the max-width:768px media query in the CSS.
function updateMobileHeaderVisibility() {
    const header = document.querySelector('.header-container');
    if (!header) return;
    const isMobile = document.body.classList.contains('mobile-nav-mode');
    header.classList.toggle('mobile-header-hidden', isMobile && currentMobileSection !== 'timer');
}

// Fades out the header icon row's "swipe for more" edge hint once
// you've scrolled close enough to the end that there's nothing left to
// reveal - otherwise it would keep implying more content past the last
// button forever. See .header-actions-wrap::after in the CSS.
function updateHeaderActionsScrollHint() {
    const wrap = document.getElementById('header-actions-wrap');
    const row = document.getElementById('header-actions');
    if (!wrap || !row) return;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    wrap.classList.toggle('at-scroll-end', atEnd);
}
(function setupHeaderActionsScrollHint() {
    const row = document.getElementById('header-actions');
    if (!row) return;
    row.addEventListener('scroll', updateHeaderActionsScrollHint, { passive: true });
    window.addEventListener('resize', updateHeaderActionsScrollHint);
    updateHeaderActionsScrollHint();
})();

// Prevents the native <details> collapse behavior on tab-controlled
// sections while in mobile-nav mode - otherwise tapping a section's
// header (still visible as a plain label) would collapse its content
// even though a bottom-nav tab is what controls visibility now.
function preventDetailsToggleInMobileNav(e) {
    if (document.body.classList.contains('mobile-nav-mode')) {
        e.preventDefault();
    }
}

// Tracks whether the page was last laid out in mobile-nav mode or not,
// so refreshMobileNavForViewport can skip all its work (including the
// section refresh above) unless the viewport has actually crossed the
// 768px breakpoint. Without this, the mobile browser's address bar
// showing/hiding while you scroll fires plain `resize` events with no
// real width change, and re-running the mobile-nav setup on every one
// of those is what caused the page to keep snapping back to the top.
let lastMobileNavViewportState = null;

function refreshMobileNavForViewport() {
    const isMobile = isMobileNavViewport();
    if (isMobile === lastMobileNavViewportState) return;
    lastMobileNavViewportState = isMobile;

    const nav = document.getElementById('mobile-bottom-nav');
    if (isMobile) {
        document.body.classList.add('mobile-nav-mode');
        if (nav) nav.style.display = 'flex';
        // A section could have been collapsed via its native <details>
        // toggle before the viewport shrank down to mobile width -
        // force every tab-controlled section back open so the tab bar
        // always has something to show.
        document.querySelectorAll('[data-mobile-section]').forEach(el => {
            if (el.tagName === 'DETAILS' && !el.open) el.open = true;
        });
        setMobileSection();
    } else {
        document.body.classList.remove('mobile-nav-mode');
        if (nav) nav.style.display = 'none';
        document.querySelectorAll('[data-mobile-section]').forEach(el => {
            el.classList.remove('mobile-section-hidden');
        });
    }
    updateMobileHeaderVisibility();
}

document.querySelectorAll('[data-mobile-section]').forEach(el => {
    if (el.tagName === 'DETAILS') {
        const summary = el.querySelector(':scope > summary.details-summary');
        if (summary) summary.addEventListener('click', preventDetailsToggleInMobileNav);
    }
});

window.addEventListener('resize', refreshMobileNavForViewport);
refreshMobileNavForViewport();
setMobileNotesView('list'); // starting screen for the mobile Notes tab - the full list, not a note
refreshCardStartTimeSuggestion(); // Log Time card opens in Hours mode by default - give Start Time a sensible first value
applyTranslations(); // paint the static UI in the saved/detected language immediately, before auth/cloud data even arrives

// --- FIRST-TIME WALKTHROUGH / REPLAYABLE TOUR ---
// Auto-starts once for a genuinely fresh install (see
// maybeAutoStartWalkthrough below, called at the very end of this file);
// anyone with existing data never sees it unprompted. Always reachable
// again afterward via the ❓ Help button in the header.
const walkthroughSteps = [
    {
        titleKey: 'walkthrough.step1Title',
        textKey: 'walkthrough.step1Text'
    },
    {
        target: '.live-timer-bar',
        mobileSection: 'timer',
        titleKey: 'walkthrough.step2Title',
        textKey: 'walkthrough.step2Text'
    },
    {
        target: '#today-strip-section',
        mobileSection: 'timer',
        titleKey: 'walkthrough.step3Title',
        textKey: 'walkthrough.step3Text'
    },
    {
        target: '#planner-section',
        mobileSection: 'plan',
        titleKey: 'walkthrough.step4Title',
        textKey: 'walkthrough.step4Text'
    },
    {
        target: '#log-time-card',
        mobileSection: 'log',
        titleKey: 'walkthrough.step5Title',
        textKey: 'walkthrough.step5Text'
    },
    {
        target: '#kanban-section',
        mobileSection: 'board',
        titleKey: 'walkthrough.step6Title',
        textKey: 'walkthrough.step6Text'
    },
    {
        target: '#notes-section',
        mobileSection: 'notes',
        titleKey: 'walkthrough.step7Title',
        textKey: 'walkthrough.step7Text'
    },
    {
        target: '#goals-section',
        mobileSection: 'stats',
        titleKey: 'walkthrough.step8Title',
        textKey: 'walkthrough.step8Text'
    },
    {
        titleKey: 'walkthrough.step9Title',
        textKey: 'walkthrough.step9Text'
    }
];

let walkthroughIndex = 0;

function startWalkthrough() {
    walkthroughIndex = 0;
    showWalkthroughStep(0);
}

function clearWalkthroughSpotlight() {
    document.querySelectorAll('.walkthrough-spotlight').forEach(el => el.classList.remove('walkthrough-spotlight'));
}

// A couple of elements (the live timer bar, the mobile bottom nav
// items) exist twice in the DOM - once for desktop, once for mobile -
// with CSS hiding whichever one doesn't apply. This picks whichever
// copy is actually on screen right now, falling back to the first
// match if neither is (e.g. mid-layout-shift).
function getVisibleWalkthroughTarget(selector) {
    const matches = document.querySelectorAll(selector);
    for (const el of matches) {
        if (el.offsetParent !== null) return el;
    }
    return matches[0] || null;
}

function positionWalkthroughPopover(targetEl) {
    const pop = document.getElementById('walkthrough-popover');
    if (!pop) return;

    if (!targetEl) {
        pop.style.transform = 'translate(-50%, -50%)';
        pop.style.top = '50%';
        pop.style.left = '50%';
        return;
    }

    pop.style.transform = 'none';
    const rect = targetEl.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    const margin = 12;

    let top = rect.bottom + margin;
    if (top + popRect.height > window.innerHeight - margin) {
        top = rect.top - popRect.height - margin;
    }
    top = Math.max(margin, Math.min(top, window.innerHeight - popRect.height - margin));

    let left = rect.left;
    left = Math.max(margin, Math.min(left, window.innerWidth - popRect.width - margin));

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
}

function showWalkthroughStep(i) {
    const step = walkthroughSteps[i];
    if (!step) { endWalkthrough(); return; }
    clearWalkthroughSpotlight();
    walkthroughIndex = i;

    // Switch to the right mobile tab first, and make sure a desktop
    // <details> section is actually open, so the target is guaranteed
    // to exist on screen before we try to point at it.
    if (step.mobileSection && isMobileNavViewport()) {
        setMobileSection(step.mobileSection);
    }

    let targetEl = null;
    if (step.target) {
        targetEl = getVisibleWalkthroughTarget(step.target);
        if (targetEl) {
            const detailsAncestor = targetEl.closest('details');
            if (detailsAncestor && !detailsAncestor.open) detailsAncestor.open = true;
        }
    }

    const overlay = document.getElementById('walkthrough-overlay');
    const pop = document.getElementById('walkthrough-popover');
    const progress = document.getElementById('walkthrough-progress');
    const title = document.getElementById('walkthrough-title');
    const text = document.getElementById('walkthrough-text');
    const backBtn = document.getElementById('walkthrough-back-btn');
    const nextBtn = document.getElementById('walkthrough-next-btn');

    if (progress) progress.innerText = t('walkthrough.stepOf', { current: i + 1, total: walkthroughSteps.length });
    if (title) title.innerText = t(step.titleKey);
    if (text) text.innerText = t(step.textKey);
    if (backBtn) backBtn.disabled = i === 0;
    if (nextBtn) nextBtn.innerText = i === walkthroughSteps.length - 1 ? t('walkthrough.done') : t('walkthrough.next');

    if (overlay) overlay.style.display = targetEl ? 'none' : 'block';
    if (pop) pop.style.display = 'block';

    if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('walkthrough-spotlight');
        // scrollIntoView is async, so measuring right away would grab
        // the popover's pre-scroll position - give it a beat to land.
        setTimeout(() => positionWalkthroughPopover(targetEl), 260);
    } else {
        positionWalkthroughPopover(null);
    }
}

function walkthroughNext() {
    if (walkthroughIndex >= walkthroughSteps.length - 1) {
        endWalkthrough();
    } else {
        showWalkthroughStep(walkthroughIndex + 1);
    }
}

function walkthroughBack() {
    if (walkthroughIndex > 0) showWalkthroughStep(walkthroughIndex - 1);
}

function endWalkthrough() {
    clearWalkthroughSpotlight();
    document.getElementById('walkthrough-overlay')?.style.setProperty('display', 'none');
    document.getElementById('walkthrough-popover')?.style.setProperty('display', 'none');
    localStorage.setItem('walkthroughDone', '1');
}

window.addEventListener('resize', () => {
    const pop = document.getElementById('walkthrough-popover');
    if (!pop || pop.style.display === 'none') return;
    const step = walkthroughSteps[walkthroughIndex];
    const targetEl = step && step.target ? getVisibleWalkthroughTarget(step.target) : null;
    positionWalkthroughPopover(targetEl);
});

// Only ever auto-starts for a genuinely fresh install with no data at
// all - anyone who already has entries, backlog items, notes, or goals
// is treated as an existing user and gets marked "done" immediately
// instead, so updating to this version never surprises them with an
// unrequested tour. New users still get it exactly once; everyone can
// always replay it from the Help button regardless. Called from
// bootAppWithSession() once real data has actually finished loading -
// calling it any earlier would see the still-empty in-memory defaults
// for EVERY user, new or not, since the real data only arrives
// asynchronously after Supabase auth resolves.
function maybeAutoStartWalkthrough() {
    if (localStorage.getItem('walkthroughDone')) return;
    const hasExistingData =
        Object.keys(timeData || {}).length > 0 ||
        (backlogItems && backlogItems.length > 0) ||
        (notesData && notesData.length > 0) ||
        Object.keys(categoryGoals || {}).length > 0;
    if (hasExistingData) {
        localStorage.setItem('walkthroughDone', '1');
        return;
    }
    startWalkthrough();
}
