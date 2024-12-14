const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Функция для получения зависимостей с использованием npm ls
const getDependencies = (packageName, depth) => {
  const command = `npm ls ${packageName} --depth=${depth} --json`;
  try {
    const result = execSync(command);
    return JSON.parse(result); // Преобразуем JSON-вывод в объект
  } catch (error) {
    console.error(`Ошибка получения зависимостей: ${error.message}`);
    return null;
  }
};

// Функция для создания графа Mermaid из зависимостей
const generateMermaidGraph = (dependencies, parent = 'root') => {
  let graph = '';
  if (dependencies && dependencies.dependencies) {
    for (const depName in dependencies.dependencies) {
      const dep = dependencies.dependencies[depName];
      graph += `${parent}-->${depName}\n`; // Добавляем зависимость в граф
      // Рекурсивно добавляем транзитивные зависимости
      graph += generateMermaidGraph(dep, depName);
    }
  }
  return graph;
};

// Функция для визуализации графа
const visualizeGraph = (mermaidGraph) => {
  // Сохраняем граф в файл
  const graphFilePath = './graph.mmd';
  fs.writeFileSync(graphFilePath, mermaidGraph);

  // Генерация визуализации с помощью Mermaid CLI
  const outputFilePath = './graph.svg';
  const mermaidCmd = `mmdc -i ${graphFilePath} -o ${outputFilePath}`;

  try {
    execSync(mermaidCmd);
    console.log('Граф был успешно сгенерирован! Изображение сохранено как graph.svg');
  } catch (error) {
    console.error('Ошибка при генерации графа:', error.message);
  } finally {
    // Удаляем временный файл графа
    fs.unlinkSync(graphFilePath);
  }
};

// Основная функция для анализа зависимостей и визуализации
const createDependencyGraph = (packageName, maxDepth) => {
  console.log(`Анализируем зависимости для пакета: ${packageName}`);
  const dependencies = getDependencies(packageName, maxDepth);

  if (dependencies) {
    console.log('Генерируем Mermaid-граф...');
    const mermaidGraph = `graph TD\n${generateMermaidGraph(dependencies)}`;
    console.log('Граф в формате Mermaid:\n', mermaidGraph);

    visualizeGraph(mermaidGraph);
  } else {
    console.log('Не удалось получить зависимости.');
  }
};

// Пример конфигурации
const packageName = 'lodash'; // Укажите имя пакета, который хотите анализировать
const maxDepth = 3; // Укажите максимальную глубину

createDependencyGraph(packageName, maxDepth);

module.exports = {
    generateMermaidGraph,
    getDependencies,
    visualizeGraph,
    createDependencyGraph,
  };
