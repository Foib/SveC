export default class Parser {
  private pos = 0;
  constructor(private input: string) {}

  parse() {
    throw new Error("Not implemented");
  }

  protected next() {
    return this.input[this.pos++];
  }

  protected peek() {
    return this.input[this.pos];
  }

  protected eof() {
    return this.pos >= this.input.length;
  }

  protected skipWhitespace() {
    while (/\s/.test(this.peek())) {
      this.next();
    }
  }

  protected readUntil(char: string) {
    let result = "";
    while (!this.eof() && this.peek() !== char) {
      result += this.next();
    }
    return result;
  }

  protected readUntilWhitespace() {
    let result = "";
    while (!this.eof() && !/\s/.test(this.peek())) {
      result += this.next();
    }
    return result;
  }

  protected readUntilEnd() {
    let result = "";
    while (!this.eof()) {
      result += this.next();
    }
    return result;
  }

  protected isString(str: string) {
    return this.input.startsWith(str, this.pos);
  }

  protected skipString(str: string) {
    if (!this.isString(str)) return false;

    this.pos += str.length;
    return true;
  }
}
