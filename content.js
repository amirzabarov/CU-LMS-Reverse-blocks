// Флаг для включения/отключения логов
const enableLogs = false;

// Функция для логирования
function log(message, ...optionalParams) {
    if (enableLogs) {
        console.log(message, ...optionalParams);
    }
}

// Регулярное выражение для проверки URL
const targetUrlPattern = /^https:\/\/my\.centraluniversity\.ru\/learn\/courses\/view\/\d+$/;

// Функция для обработки элемента tui-accordion
function processAccordion(target) {
    log("[ReverseAccordion] Processing tui-accordion...");
    const items = Array.from(target.querySelectorAll('tui-accordion-item'));
    log(`[ReverseAccordion] Found ${items.length} items in tui-accordion.`);
    if (items.length > 0) {
        // Инверсируем элементы
        items.forEach(item => target.removeChild(item));
        items.reverse().forEach(item => target.appendChild(item));
        log("[ReverseAccordion] Items successfully reversed.");
    } else {
        log("[ReverseAccordion] No items found in tui-accordion.");
    }
}

// Функция для проверки наличия списка и запуска обработки
function checkAndProcessAccordion() {
    const target = document.querySelector('tui-accordion');
    if (target) {
        log("[ReverseAccordion] Target tui-accordion found immediately. Processing...");
        processAccordion(target);
        return true; // Указываем, что список найден и обработан
    }
    log("[ReverseAccordion] Target tui-accordion not found. Observer will be started.");
    return false; // Список не найден
}

// Функция для запуска наблюдателя
function startObserver() {
    log("[ReverseAccordion] Starting observer for tui-accordion...");

    // Настройка MutationObserver
    const observer = new MutationObserver((mutationsList, obs) => {
        const target = document.querySelector('tui-accordion'); // Ищем целевой элемент
        if (target) {
            log("[ReverseAccordion] Target element 'tui-accordion' found by MutationObserver.");
            obs.disconnect(); // Отключаем наблюдатель после обнаружения элемента
            processAccordion(target); // Вызываем функцию обработки
        }
    });

    // Запускаем наблюдатель
    observer.observe(document, { childList: true, subtree: true });
    log("[ReverseAccordion] Observer initialized.");
}

// Функция для проверки URL и запуска обработки или наблюдателя
function handleUrlChange(url) {
    if (targetUrlPattern.test(url)) {
        log("[ReverseAccordion] Target URL detected:", url);
        // Сначала пытаемся обработать список, если он уже загружен
        const processed = checkAndProcessAccordion();
        if (!processed) {
            // Если списка нет, запускаем наблюдатель
            startObserver();
        }
    } else {
        log("[ReverseAccordion] URL is not a target. Skipping processing.");
    }
}

// Отслеживание изменений URL через setInterval
let lastUrl = window.location.href;
setInterval(() => {
    if (window.location.href !== lastUrl) {
        const newUrl = window.location.href;
        log(`[ReverseAccordion] URL change detected: ${newUrl}`);
        lastUrl = newUrl;
        handleUrlChange(newUrl); // Обрабатываем изменение URL
    }
}, 20);

// Инициализация: проверяем текущий URL при загрузке скрипта
log("[ReverseAccordion] Script initialized. Checking initial URL...");
handleUrlChange(window.location.href);
