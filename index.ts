import * as ts from 'typescript'

interface Result {
  children: any[]
  depth: number
  filename?: string
  type?: string
  [key: string]: any
}

export function analyze(filenames: string[]) {
  const program = ts.createProgram(filenames, {
    target: ts.ScriptTarget.ES2019,
    module: ts.ModuleKind.CommonJS,
  })
  const checker = program.getTypeChecker()
  const tsFiles = program.getSourceFiles().filter(file => !file.isDeclarationFile)
  let results: Result[] = []
  const depth = 1
  for (const sourceFile of tsFiles) {
    // ts.forEachChild(sourceFile, analyzeNode)
    const children = sourceFile.getChildren().map(child => analyzeNode(child, depth))
    const result: Result = {
      children,
      depth,
      filename: sourceFile.fileName,
    }
    results.push(result)
  }
  // console.dir(results)
  // console.dir(results[0].children)

  function analyzeNode(node: ts.Node, depth: number) {
    const type = checker.getTypeAtLocation(node)
    // console.log(new Array(depth + 1).join('----'), node.kind, node.pos, node.end, checker.typeToString(type))
    // console.log(checker.typeToString(type))
    depth += 1
    const children = node.getChildren().map(child => analyzeNode(child, depth))
    const nodeResult = {
      ...node,
      children,
      depth,
      type: checker.typeToString(type),
    }
    return nodeResult
  }
}

analyze(['./test.ts'])
