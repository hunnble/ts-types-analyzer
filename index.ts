import * as fs from 'fs'
import * as ts from 'typescript'

export function loadFile(filename: string) {
  const fileContent = fs.readFileSync(filename).toString()
  const sourceFile = ts.createSourceFile(filename, fileContent, ts.ScriptTarget.ES2015, true)
  return sourceFile
}

export function analyze(sourceFile: ts.SourceFile) {
  // TODO: analyze
}
