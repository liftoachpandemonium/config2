const fs = require('fs');
const xml2js = require('xml2js');
const { execSync } = require('child_process');
const path = require('path');

// Чтение конфигурации из XML
async function readConfig(filePath) {
  const xmlData = fs.readFileSync(filePath, 'utf-8');
  const parsedData = await xml2js.parseStringPromise(xmlData);
  return parsedData.configuration;
}

// Получение зависимостей пакета рекурсивно с учётом глубины
function getDependencies(packageName, maxDepth, currentDepth = 0) {
  if (currentDepth >= maxDepth) return {};

  try {
    const dependencies = execSync(`npm view ${packageName} dependencies --json`, { encoding: 'utf-8' });
    const depJson = JSON.parse(dependencies);
    
    const result = {};
    for (let dep in depJson) {
      result[dep] = getDependencies(dep, maxDepth, currentDepth + 1);
    }
    return result;
  } catch (error) {
    console.error(`Ошибка получения зависимостей для ${packageName}:`, error.message);
    return {};
  }
}

// Построение графа в формате Mermaid
function buildMermaidGraph(dependencies, packageName) {
  let graph = `graph LR\n    ${packageName}[${packageName}]\n`;

  function addDependencies(depName, deps) {
    for (let dep in deps) {
      graph += `    ${depName} --> ${dep}[${dep}]\n`;
      addDependencies(dep, deps[dep]);
    }
  }

  addDependencies(packageName, dependencies);
  return graph;
}

// Визуализация графа через внешний инструмент (Mermaid CLI)
function visualizeGraph(mermaidGraph, visualizerPath) {
  const graphFilePath = path.join(__dirname, '/tmp/dependencies.mmd');
  const svgFilePath = path.join(__dirname, '/tmp/dependencies.svg');

  fs.writeFileSync(graphFilePath, mermaidGraph);

  try {
    execSync(`${visualizerPath} ${graphFilePath} -o ${svgFilePath}`);
    console.log(`Граф сохранён в ${svgFilePath}`);
  } catch (error) {
    console.error(`Ошибка визуализации графа: ${error.message}`);
  }
}

// Основная функция для визуализации зависимостей
async function visualizeDependencies(configPath) {
  const config = await readConfig(configPath);
  const { 'path-to-visualizer': visualizerPath, 'package-name': packageName, 'max-depth': maxDepth } = config;

  console.log(`Анализируем пакет: ${packageName}`);
  console.log(`Максимальная глубина зависимостей: ${maxDepth}`);
  
  const dependencies = getDependencies(packageName, parseInt(maxDepth));
  const mermaidGraph = buildMermaidGraph(dependencies, packageName);

  // Визуализируем граф
  visualizeGraph(mermaidGraph, visualizerPath);
}

// Вызов функции с конфигурационным файлом
const configFilePath = 'config.xml'; // Путь к вашему конфигурационному файлу
visualizeDependencies(configFilePath);
