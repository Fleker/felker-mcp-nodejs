import { Context } from "fastmcp";
import { spawn } from "node:child_process";

export interface Config {
  yolo?: boolean
  model?: string
  processErrors?: boolean
}

export async function runAgent(instructions: string[], context: Context<any>, config?: Config) {
  for (let i = 0; i < instructions.length; i++) {
    await context.reportProgress({ progress: i, total: instructions.length })
    console.log(`    > ${instructions[i]}}`)
    await runInstruction(instructions[i], context, config)
  }
}

async function runInstruction(instruction: string, context: Context<any>, config?: Config) {
  return new Promise((resolve) => {
    const params: string[] = []
    if (config?.yolo ?? true) {
      params.push('--yolo')
    }
    params.push('--model', config?.model ?? 'gemini-2.5-flash')
    params.push('--prompt', `"${instruction}"`)

    var res = spawn('gemini', params, {
      shell: true,
      detached: true,
    })
    res.stdout.on('data', (data) => {
      console.log(`${data}`);
      context.streamContent({
        type: 'text',
        text: data
      }) // unawaited
    });
    if (config?.processErrors) {
      res.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
    }
    res.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      res.kill() // we should be done now??
      resolve('script complete')
    });
    res.unref()
  })
}
