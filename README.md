# Проект: Инструмент командной строки для визуализации графа зависимостей

## Описание
Этот проект представляет собой инструмент командной строки, работающий на основе node-js приложения. Основная цель — визуализация графа зависимостей, включая транзитивные зависимости. 

Основные возможности программы:
- Получение зависимостей пакетов с определенной глубиной.
- Генерация графа зависимостей в формате Mermaid.
- Визуализация графа в SVG-формате.
- Обработка ошибок при неправильных зависимостях.


## Установка
```bash
 - git clone https://github.com/liftoachpandemonium/config2.git
```

## Функции

### Основные функции
### 1. `getDependencies(packageName, depth)`

**Описание**: Получает зависимости для указанного пакета с заданной глубиной поиска. Использует команду `npm ls` для получения информации о зависимостях пакета и преобразует результаты в формат JSON.

**Параметры**:
- `packageName` (string): имя пакета для получения зависимостей.
- `depth` (number): максимальная глубина зависимостей для поиска (по умолчанию 1).

**Возвращает**:
- Объект зависимостей в формате JSON.
- В случае ошибки возвращается `null`.

### 2. `generateMermaidGraph(dependencies, parent = 'root')`

**Описание**: Генерирует строку в формате Mermaid, представляющую граф зависимостей.

**Параметры**:
- `dependencies` (object): объект зависимостей, который должен быть преобразован в граф.
- `parent` (string, по умолчанию 'root'): имя родительского узла.

**Возвращает**:
- Строку графа в формате Mermaid.

### 3. `visualizeGraph(mermaidGraph)`

**Описание**: Визуализирует граф зависимостей, используя Mermaid CLI, и сохраняет результат в файл SVG.

**Параметры**:
- `mermaidGraph` (string): строка графа, генерированная функцией `generateMermaidGraph`.

**Действия**:
- Сохраняет граф в файл `.md`.
- Генерирует SVG-файл с помощью инструмента `mmdc` (CLI для Mermaid).

### 4. `createDependencyGraph(packageName, maxDepth)`

**Описание**: Основная функция для анализа зависимостей пакета, создания графа и его визуализации.

**Параметры**:
- `packageName` (string): имя пакета для анализа зависимостей.
- `maxDepth` (number): максимальная глубина для поиска зависимостей.

**Действия**:
- Получает зависимости с помощью `getDependencies`.
- Генерирует граф зависимостей с помощью `generateMermaidGraph`.
- Визуализирует граф с помощью `visualizeGraph`.


## Настройка и запуск проекта

### Требования
- node.js
- Модуль Mermaid

### Запуск
Для запуска эмулятора файловой системы выполните команду:

   ```bash
   npm init
   npm install -g @mermaid-js/mermaid-cli
   node index.js
```
   


   
### Пример работы программы
![image](https://github.com/user-attachments/assets/ff2d028d-cbb1-48de-bfa6-107460775ed3)
![image](https://github.com/user-attachments/assets/73a2f5ab-be62-4c7d-98ec-f42f9b486e11)



## Тестирование
Набор тестов проверяет функции для визуаоищации графа зависимостей, чтобы убедиться в их корректной работе в различных ситуациях. Тесты реализованы с использованием библиотеки `jest`, и включают следующие проверки:

## Описание тестов

Тесты для проекта написаны с использованием библиотеки Jest и направлены на проверку корректности работы функций по получению зависимостей, их визуализации и обработки ошибок.

### 1. **Тест: should fetch dependencies successfully**

**Цель:** Проверка успешного получения зависимостей для указанного пакета.

Этот тест проверяет, что функция `getDependencies` успешно извлекает зависимости для пакета `lodash`, если команда `execSync` возвращает корректный JSON, описывающий зависимости. Мокируется команда `npm ls`, которая возвращает объект зависимостей в виде строки JSON.

**Ожидаемый результат:**
- Функция должна вернуть объект с зависимостями.
- В объекте должны быть данные о пакете `lodash` и его зависимостях.

### 2. **Тест: should handle errors when fetching dependencies**

**Цель:** Проверка обработки ошибок при неудачном получении зависимостей.

**Описание:**  
В данном тесте смоделирована ошибка, которая возникает, если команда `execSync` вызывает исключение (например, если пакет не существует). Функция `getDependencies` должна вернуть `null` в случае возникновения ошибки, что обеспечивает правильную обработку исключений.

**Ожидаемый результат:**
- Функция должна вернуть `null`, если команда для получения зависимостей не удалась (например, из-за несуществующего пакета).

### 3. **Тест: should generate mermaid graph**

**Цель:** Проверка корректности генерации графа Mermaid на основе зависимостей.

**Описание:**  
Этот тест проверяет, что функция `generateMermaidGraph` правильно генерирует строку для графа Mermaid на основе входных данных о зависимостях. Мокируется объект зависимостей для пакета `lodash`, включающий зависимости для `lodash.isempty`. Ожидается, что строка будет включать отношения между `root`, `lodash` и `lodash.isempty`.

**Ожидаемый результат:**
- Сгенерированная строка должна содержать правильные связи для узлов в формате Mermaid, например `root-->lodash` и `lodash-->lodash.isempty`.

### 4. **Тест: should visualize graph (create an SVG file)**

**Цель:** Проверка корректности процесса визуализации графа и создания SVG-файла.

**Описание:**  
Этот тест проверяет, что функция `visualizeGraph` сохраняет строку графа в файл `.mmd` и вызывает команду для генерации изображения SVG с использованием инструмента `mmdc` (Mermaid CLI). Используется мокирование метода `writeFileSync` для проверки сохранения файла и мока команды для создания изображения в формате SVG.

**Ожидаемый результат:**
- Должен быть вызван метод `writeFileSync` для сохранения графа в файл `.mmd`.
- Команда `mmdc` должна быть вызвана для создания SVG изображения.

### 5. **Тест: should handle graph creation failure**

**Цель:** Проверка обработки ошибки при создании графа.

**Описание:**  
Этот тест проверяет, что происходит, если команда для генерации SVG (с помощью `mmdc`) не удалась, и обрабатывает ли система это корректно. Мокируется ошибка в процессе создания графа, и проверяется, что в случае ошибки выводится сообщение об ошибке "Не удалось получить зависимости."

**Ожидаемый результат:**
- Если процесс генерации графа завершился с ошибкой, должно быть выведено сообщение "Не удалось получить зависимости."
  
## Как запускать тесты

После установки всех зависимостей, запустите тесты с помощью команды:

```bash
npm test
```
![image](https://github.com/user-attachments/assets/9905b040-e1a1-476c-8d8e-e3324a629b07)


