import * as fs from 'fs'
import * as ts from 'typescript'

// export function loadFile(filename: string) {
//   const fileContent = fs.readFileSync(filename).toString()
//   const sourceFile = ts.createSourceFile(filename, fileContent, ts.ScriptTarget.ES2019, true)
//   return sourceFile
// }

// export function analyzeNode(node: ts.Node) {
//   console.log(ts.SyntaxKind[node.kind])
//   console.log('===')
//   ts.forEachChild(node, analyzeNode)
// }

// export function analyze(sourceFile: ts.SourceFile) {
//   analyzeNode(sourceFile)
// }

// const file = loadFile('./test.ts')
// analyze(file)

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
    // const symbol = checker.getSymbolAtLocation(node)
    // if (symbol) {
    //   console.log(checker.typeToString(
    //     checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    //   ))
    // }
    const type = checker.getTypeAtLocation(node)
    console.log(checker.typeToString(type))
    ts.forEachChild(node, analyzeNode)
  }
}

analyze(['./test.ts'])
