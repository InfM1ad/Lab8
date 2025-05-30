// Конфигурация приложения
const CONFIG = {
    prices: {
        standard: 440,
        comfort: 490,
        wheelchair: 410
    },
    sessionTimes: ['10:40', '13:10', '15:40', '18:10', '20:35', '23:00'],
    // Схема зала для варианта 2
    hallLayout: [
        '00111111111111111111100',
        '00111111111111111111100',
        '00111111111111111111100',
        '00111111111111111111100',
        '00111111111111111111100',
        '00111111111111111111100',
        '00111111111111111111100',
        '00222222222222222222200',
        '00222222222222222222200',
        '00222222222222222222200',
        '33333333333333333333333'
    ]
};

// Глобальные переменные
let selectedSeats = [];
let totalPrice = 0;

// SVG иконки
const SEAT_SVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="IconBase" xmlns="http://www.w3.org/2000/svg"><path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M26 5H7V11H4V27H28V11H26V5Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 5.3H8C7.6134 5.3 7.3 5.6134 7.3 6V10.3223C7.63435 10.3726 7.9416 10.5057 8.20021 10.7C8.20022 10.7 8.20022 10.7 8.20023 10.7C8.68588 11.0649 9 11.6458 9 12.3V22H23V12.3C23 11.6458 23.3141 11.0649 23.7998 10.7C24.0584 10.5057 24.3656 10.3726 24.7 10.3223V6C24.7 5.6134 24.3866 5.3 24 5.3ZM26 10.3V6C26 4.89543 25.1046 4 24 4H8C6.89543 4 6 4.89543 6 6V10.3H5C3.89543 10.3 3 11.1954 3 12.3V22V23.3V26C3 27.1046 3.89543 28 5 28H27C28.1046 28 29 27.1046 29 26V23.3V22V12.3C29 11.1954 28.1046 10.3 27 10.3H26ZM4.3 12.3C4.3 11.9134 4.6134 11.6 5 11.6H7C7.3866 11.6 7.7 11.9134 7.7 12.3V22H4.3V12.3ZM27.7 12.3V22L24.3 22V12.3C24.3 11.9134 24.6134 11.6 25 11.6H27C27.3866 11.6 27.7 11.9134 27.7 12.3ZM4.3 23.3H27.7V26C27.7 26.3866 27.3866 26.7 27 26.7H5C4.6134 26.7 4.3 26.3866 4.3 26V23.3Z"></path></svg>`;

const WHEELCHAIR_SVG = `<svg width="15" height="18" viewBox="0 0 15 18" class="IconBase" xmlns="http://www.w3.org/2000/svg"><path d="M5.772 3.4a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zm8.17 11.265l-2.504-3.44-.177-.244a1.1 1.1 0 0 0-.23-.234.643.643 0 0 0-.485-.22H7.472V9.66H9.68a.569.569 0 0 0 .571-.572.572.572 0 0 0-.571-.571H7.473V5.824a1.7 1.7 0 1 0-3.4 0v.9A5.765 5.765 0 0 0 1.686 8.16 5.753 5.753 0 0 0 0 12.237a5.735 5.735 0 0 0 1.688 4.076 5.743 5.743 0 0 0 4.077 1.688 5.736 5.736 0 0 0 4.076-1.688 5.74 5.74 0 0 0 1.235-1.832l.002-.007 1.082 1.488a1.102 1.102 0 1 0 1.782-1.297zm-8.179 2.22a4.655 4.655 0 0 1-4.649-4.648 4.658 4.658 0 0 1 2.958-4.332v2.621l-.002.223v.34l.001.081c0 .862.699 1.56 1.56 1.56h4.176l.464.638a4.652 4.652 0 0 1-4.508 3.518z"></path></svg>`;

const TICKET_SVG = `<svg width="18" height="20" viewBox="0 0 18 20" class="IconBase" xmlns="http://www.w3.org/2000/svg"><path d="M16.813 0c-.434 0-1.071.578-1.33.828l-.623.611a.572.572 0 0 1-.402.16.574.574 0 0 1-.402-.16l-.633-.613C12.998.416 12.293 0 11.769 0s-1.229.416-1.654.826l-.634.613a.578.578 0 0 1-.405.16.578.578 0 0 1-.405-.16L8.036.826C7.622.426 6.901 0 6.382 0c-.52 0-1.24.426-1.654.826l-.635.613a.579.579 0 0 1-.405.16.579.579 0 0 1-.405-.16L2.648.826C2.613.793 1.772 0 1.263 0 .683 0 .461.787.461 1.461V18.54c0 .674.221 1.461.802 1.461.49 0 1.279-.742 1.365-.825l.645-.614a.585.585 0 0 1 .409-.16c.155 0 .3.057.408.16l.636.613c.414.4 1.135.826 1.655.826s1.24-.426 1.655-.826l.635-.613a.578.578 0 0 1 .405-.16c.155 0 .299.057.405.16l.635.613c.414.4 1.135.826 1.654.826.52 0 1.24-.426 1.655-.826l.634-.613a.578.578 0 0 1 .405-.16c.155 0 .299.057.405.16l.635.613c.32.308.9.826 1.309.826.478 0 .726-.519.726-1.461V1.46c0-.94-.249-1.46-.726-1.46zm-3.018 15.023H9.593v-1.735h4.2v1.735zm0-4.201H4.296V9.178h9.497v1.644zm0-4.11H4.296V4.977h9.497v1.735z"></path></svg>`;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setCurrentDateTime();
    generateSeatsMap();
    initializeEventListeners();
    addHoverStyles();
}

// Добавляем стили для hover эффектов
function addHoverStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .seat {
            transition: transform 0.2s ease, opacity 0.2s ease;
        }
        
        .seat:not(.occupied):hover {
            transform: scale(1.1);
            cursor: pointer;
        }
        
        .seat.selected:hover {
            opacity: 0.8;
        }
        
        .seat:not(.selected):not(.occupied):hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
}

// Установка текущей даты и случайного времени сеанса
function setCurrentDateTime() {
    const currentDate = new Date().toLocaleDateString('ru-RU');
    const randomTime = CONFIG.sessionTimes[Math.floor(Math.random() * CONFIG.sessionTimes.length)];
    
    document.getElementById('current-date').textContent = currentDate;
    document.getElementById('session-time').textContent = randomTime;
}

// Генерация схемы мест
function generateSeatsMap() {
    const seatsMap = document.getElementById('seats-map');
    seatsMap.innerHTML = '';

    CONFIG.hallLayout.forEach((rowPattern, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        // Номер ряда слева
        const leftNumber = document.createElement('div');
        leftNumber.className = 'row-number';
        leftNumber.textContent = rowIndex + 1;
        rowDiv.appendChild(leftNumber);

        // Контейнер для мест
        const seatsContainer = document.createElement('div');
        seatsContainer.className = 'seats-container';

        let seatNumber = 1;
        for (let i = 0; i < rowPattern.length; i++) {
            const char = rowPattern[i];
            
            if (char === '0') {
                // Проход
                const aisle = document.createElement('div');
                aisle.className = 'aisle';
                seatsContainer.appendChild(aisle);
            } else {
                // Место
                const seat = createSeat(rowIndex + 1, seatNumber, char);
                seatsContainer.appendChild(seat);
                seatNumber++;
            }
        }

        rowDiv.appendChild(seatsContainer);

        // Номер ряда справа
        const rightNumber = document.createElement('div');
        rightNumber.className = 'row-number';
        rightNumber.textContent = rowIndex + 1;
        rowDiv.appendChild(rightNumber);

        seatsMap.appendChild(rowDiv);
    });
}

// Создание элемента места
function createSeat(row, seatNumber, type) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.dataset.row = row;
    seat.dataset.seat = seatNumber;
    
    let seatType, price;
    switch (type) {
        case '1':
            seatType = 'standard';
            price = CONFIG.prices.standard;
            seat.innerHTML = SEAT_SVG;
            break;
        case '2':
            seatType = 'comfort';
            price = CONFIG.prices.comfort;
            seat.innerHTML = SEAT_SVG;
            break;
        case '3':
            seatType = 'wheelchair';
            price = CONFIG.prices.wheelchair;
            seat.innerHTML = WHEELCHAIR_SVG;
            break;
    }
    
    seat.classList.add(seatType);
    seat.dataset.type = seatType;
    seat.dataset.price = price;

    // Случайно делаем некоторые места занятыми
    if (Math.random() < 0.15) {
        seat.classList.add('occupied');
    }

    // Добавляем обработчик клика
    seat.addEventListener('click', handleSeatClick);

    return seat;
}

// Обработка клика по месту
function handleSeatClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const seat = event.target.closest('.seat');
    if (!seat || seat.classList.contains('occupied')) return;

    const row = parseInt(seat.dataset.row);
    const seatNum = parseInt(seat.dataset.seat);
    const type = seat.dataset.type;
    const price = parseInt(seat.dataset.price);

    if (seat.classList.contains('selected')) {
        // Отменяем выбор места
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => !(s.row === row && s.seat === seatNum));
    } else {
        // Временно добавляем место для проверки правила
        const tempSeat = { row, seat: seatNum, type, price };
        selectedSeats.push(tempSeat);
        
        // Проверяем правило промежутка
        if (!checkSeatGapRule()) {
            // Убираем место и показываем предупреждение
            selectedSeats.pop();
            seat.classList.add('shake');
            setTimeout(() => seat.classList.remove('shake'), 500);
            showWarningModal();
            return;
        }
        
        // Если правило соблюдено, выбираем место
        seat.classList.add('selected');
    }

    updateSelectedSeatsDisplay();
    updateTotalPrice();
}

// Проверка правила промежутка между местами
function checkSeatGapRule() {
    if (selectedSeats.length < 2) return true;

    // Группируем места по рядам
    const seatsByRow = {};
    selectedSeats.forEach(seat => {
        if (!seatsByRow[seat.row]) {
            seatsByRow[seat.row] = [];
        }
        seatsByRow[seat.row].push(seat.seat);
    });

    // Проверяем каждый ряд
    for (const row in seatsByRow) {
        const seats = seatsByRow[row].sort((a, b) => a - b);
        
        for (let i = 0; i < seats.length - 1; i++) {
            const gap = seats[i + 1] - seats[i];
            if (gap === 2) {
                // Промежуток в одно место недопустим
                return false;
            }
        }
    }

    return true;
}

// Обновление отображения выбранных мест
function updateSelectedSeatsDisplay() {
    const selectedSeatsDiv = document.getElementById('selected-seats');
    const selectedList = document.getElementById('selected-list');

    if (selectedSeats.length === 0) {
        selectedSeatsDiv.style.display = 'none';
        return;
    }

    selectedSeatsDiv.style.display = 'block';
    selectedList.innerHTML = '';

    selectedSeats.forEach(seat => {
        const seatItem = document.createElement('div');
        seatItem.className = 'seat-item';
        
        const seatInfo = document.createElement('span');
        seatInfo.textContent = `Ряд ${seat.row}, место ${seat.seat} (${getSeatTypeName(seat.type)}) - ${seat.price} ₽`;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-seat';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => removeSeat(seat.row, seat.seat);
        
        seatItem.appendChild(seatInfo);
        seatItem.appendChild(removeBtn);
        selectedList.appendChild(seatItem);
    });
}

// Получение названия типа места
function getSeatTypeName(type) {
    switch (type) {
        case 'standard': return 'Стандартное';
        case 'comfort': return 'Комфорт';
        case 'wheelchair': return 'Для инвалида-колясочника';
        default: return type;
    }
}

// Удаление места из выбранных
function removeSeat(row, seatNum) {
    selectedSeats = selectedSeats.filter(s => !(s.row === row && s.seat === seatNum));
    
    const seatElement = document.querySelector(`.seat[data-row="${row}"][data-seat="${seatNum}"]`);
    if (seatElement) {
        seatElement.classList.remove('selected');
    }
    
    updateSelectedSeatsDisplay();
    updateTotalPrice();
}

// Обновление общей стоимости
function updateTotalPrice() {
    totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    document.getElementById('total-price').textContent = totalPrice;
    
    const confirmBtn = document.getElementById('confirm');
    confirmBtn.disabled = selectedSeats.length === 0;
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    // Кнопка "Выкупить весь зал"
    document.getElementById('buy-all').addEventListener('click', handleBuyAllClick);
    
    // Кнопка "Продолжить"
    document.getElementById('confirm').addEventListener('click', handleConfirmClick);
    
    // Модальные окна
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', hideAllModals);
    });
    
    document.querySelector('.modal-confirm').addEventListener('click', handleBuyAllConfirm);
    document.querySelector('.modal-cancel').addEventListener('click', handleBuyAllCancel);
    
    // Закрытие модальных окон по клику вне их
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideAllModals();
            }
        });
    });
}

// Обработка клика "Выкупить весь зал"
function handleBuyAllClick() {
    showBuyAllModal();
}

// Обработка клика "Продолжить"
function handleConfirmClick() {
    if (selectedSeats.length === 0) return;
    
    alert(`Переход к оплате ${totalPrice} ₽ за ${selectedSeats.length} мест`);
}

// Показ модального окна предупреждения
function showWarningModal() {
    document.getElementById('warning-modal').classList.add('show');
}

// Показ модального окна "Выкупить весь зал"
function showBuyAllModal() {
    document.getElementById('buyall-modal').classList.add('show');
}

// Скрытие всех модальных окон
function hideAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Подтверждение выкупа всего зала
function handleBuyAllConfirm() {
    // Выбираем все свободные места
    selectedSeats = [];
    document.querySelectorAll('.seat').forEach(seat => {
        if (!seat.classList.contains('occupied')) {
            seat.classList.add('selected');
            selectedSeats.push({
                row: parseInt(seat.dataset.row),
                seat: parseInt(seat.dataset.seat),
                type: seat.dataset.type,
                price: parseInt(seat.dataset.price)
            });
        }
    });
    
    // Применяем скидку 20%
    totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0) * 0.8;
    
    updateSelectedSeatsDisplay();
    document.getElementById('total-price').textContent = Math.round(totalPrice);
    
    // Отключаем кнопку "Выкупить весь зал"
    document.getElementById('buy-all').disabled = true;
    
    hideAllModals();
}

// Отмена выкупа всего зала
function handleBuyAllCancel() {
    hideAllModals();
}