import * as ts from 'typescript'

interface Result {
  children: any[]
  depth: number
  name?: string
  filename?: string
  type?: string
  [key: string]: any
}

interface Options {
  target?: ts.ScriptTarget,
  module?: ts.ModuleKind,
}

export function analyze(filenames: string[], options: Options = {}) {
  const {
    target = ts.ScriptTarget.ES2019,
    module = ts.ModuleKind.CommonJS
  } = options
  const program = ts.createProgram(filenames, {
    target,
    module,
  })
  const checker = program.getTypeChecker()
  const tsFiles = program.getSourceFiles().filter(file => !file.isDeclarationFile)
  let results: Result[] = []
  const depth = 1
  for (const sourceFile of tsFiles) {
    const children = sourceFile.getChildren().map(child => analyzeNode(child, depth))
    const result: Result = {
      children,
      depth,
      name: ts.SyntaxKind[sourceFile.kind],
      filename: sourceFile.fileName,
    }
    results.push(result)
  }
  // console.dir(results)
  // console.dir(results[0].children)

  function analyzeNode(node: ts.Node, depth: number) {
    const type = checker.getTypeAtLocation(node)
    depth += 1
    const children = node.getChildren().map(child => analyzeNode(child, depth))
    const nodeResult = {
      ...node,
      children,
      depth,
      name: ts.SyntaxKind[node.kind],
      type: checker.typeToString(type),
    }
    return nodeResult
  }
}

analyze(['./test.ts'])
