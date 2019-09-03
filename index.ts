import * as ts from 'typescript'

export function analyze(filenames: string[]) {
  const program = ts.createProgram(filenames, {
    target: ts.ScriptTarget.ES2019,
    module: ts.ModuleKind.CommonJS,
  })
  const checker = program.getTypeChecker()
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      ts.forEachChild(sourceFile, analyzeNode)
    }
  }

  function analyzeNode(node: ts.Node) {
    const type = checker.getTypeAtLocation(node)
    console.log(checker.typeToString(type))
    ts.forEachChild(node, analyzeNode)
  }
}

analyze(['./test.ts'])
