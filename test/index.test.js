const fs = require('fs');
const { execSync } = require('child_process');
const {
  generateMermaidGraph,
  getDependencies,
  visualizeGraph,
  createDependencyGraph
} = require('../index');

// Мокируем execSync для тестов
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

// Мокируем fs для тестов (запись файлов)
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn()
}));

describe('Dependency Graph Tests', () => {

  test('should fetch dependencies successfully', () => {
    const mockResult = JSON.stringify({
      dependencies: {
        lodash: {
          dependencies: {
            'lodash.isempty': {}
          }
        }
      }
    });

    execSync.mockReturnValue(mockResult);
    const packageName = 'lodash';
    const maxDepth = 3;
    const dependencies = getDependencies(packageName, maxDepth);

    expect(dependencies).toBeDefined();
    expect(dependencies.dependencies).toHaveProperty('lodash');
  });

  test('should handle errors when fetching dependencies', () => {
    execSync.mockImplementation(() => { throw new Error('Command failed') });
    const packageName = 'non-existent-package';
    const dependencies = getDependencies(packageName, 1);

    expect(dependencies).toBeNull();
  });

  test('should generate mermaid graph', () => {
    const mockDependencies = {
      dependencies: {
        lodash: {
          dependencies: {
            'lodash.isempty': {}
          }
        }
      }
    };

    const mermaidGraph = generateMermaidGraph(mockDependencies);
    expect(mermaidGraph).toContain('root-->lodash');
    expect(mermaidGraph).toContain('lodash-->lodash.isempty');
  });

  test('should visualize graph (create an SVG file)', () => {
    const mockMermaidGraph = 'graph TD\nroot-->lodash\nlodash-->lodash.isempty';
    visualizeGraph(mockMermaidGraph);

    // Проверяем, что writeFileSync был вызван для сохранения графа
    expect(fs.writeFileSync).toHaveBeenCalledWith('./graph.mmd', mockMermaidGraph);

    // Проверяем вызов командной строки для создания SVG
    expect(execSync).toHaveBeenCalledWith('mmdc -i ./graph.mmd -o ./graph.svg');
  });


  test('should handle graph creation failure', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Мокируем console.log
    execSync.mockImplementation(() => { throw new Error('Command failed') });

    createDependencyGraph('lodash', 3);

    expect(logSpy).toHaveBeenCalledWith('Не удалось получить зависимости.');
  });

});

