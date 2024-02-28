import path from "path";
import fs from "fs";
import { HTMLElement, TextNode, parse } from "node-html-parser";
import filesInDirectory from "./filesInDirectory";
import Parser from "./parser";

const fileExtension = ".svec";
let rootFolder = path.resolve(__dirname);
let outputFolder = path.resolve(__dirname, "output");

if (process.argv.length > 2) {
  rootFolder = path.resolve(process.argv[2]);
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

const files = filesInDirectory(rootFolder, fileExtension);

if (files.length === 0) {
  console.log(
    `No files found in ${rootFolder} with extension ${fileExtension}`
  );
  process.exit(0);
}

files.forEach((file) => {
  const name = path.basename(file, fileExtension);
  const content = fs.readFileSync(file, "utf-8");

  const outputFolder = path.resolve(__dirname, name);
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  } else {
    const files = fs.readdirSync(outputFolder);
    for (const file of files) {
      fs.unlinkSync(path.join(outputFolder, file));
    }
  }

  const parsed = parseSvec(content);
  console.log(parsed);
});

// compile svec file to svelte components

// <script lang="ts">
//     /* {svecSlot} */;
//
//     onMount(() => {
//         console.log(y);
//     });
// </script>
//
// {#comp Test}
//     <script lang="ts">
//         let x = 0;
//         let y = "Test";
//
//         console.log(x);
//     </script>
//
//     <div>
//         <p>Hello</p>
//     </div>
// {/comp}
//
// {#comp AnotherComp}
//     <h1>Hello there!</h1>
// {/comp}

type SvecComponent = {
  script: string;
  html: string;
  style: string;
};

function parseSvec(content: string) {
  const parsed = parse(content);
  let currentComponent = "_global";
  const data = new Map<string, SvecComponent>([
    [currentComponent, { script: "", html: "", style: "" }],
  ]);

  function htmlNode(node: HTMLElement) {
    const element = node as HTMLElement;
    if (element.rawTagName === "script") {
    }
  }

  class TextNodeParser extends Parser {
    parse() {
      while (!this.eof()) {
        this.skipWhitespace();

        if (this.skipString("{")) {
          this.skipWhitespace();
          if (this.skipString("#comp")) {
            this.skipWhitespace();
            const name = this.readUntil("}");
            this.skipString("}");
            currentComponent = name;
            data.set(name, { script: "", html: "", style: "" });
          } else if (this.skipString("/comp")) {
            this.readUntil("}");
            this.skipString("}");
            currentComponent = "_global";
          }
        }
      }
    }
  }

  console.log(parsed.childNodes);
  for (let i = 0; i < parsed.childNodes.length; i++) {
    const child = parsed.childNodes[i];

    switch (child.nodeType) {
      case 1:
        htmlNode(child as HTMLElement);
        break;

      case 3:
        const node = child as TextNode;
        const parser = new TextNodeParser(node.rawText);
        parser.parse();
        break;
    }
  }

  return data;
}
