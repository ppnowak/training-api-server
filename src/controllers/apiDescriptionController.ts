import { Converter } from 'showdown';
import { Request, Response } from 'express'
import { readFileSync } from 'fs';
import { join } from 'path';

const converter = new Converter();
let tmp: string;

const getMarkdown = () => {
    if (tmp) {
        return tmp;
    }
    const path = join(__dirname, '..', '..', 'api.MD');
    tmp = converter.makeHtml(readFileSync(path, 'utf-8'));
    return tmp;
}

export const getApiDescription = (req: Request, res: Response): void => {
  const html = `<html>
    <head>
      <link rel="stylesheet" href="files/style.css">
    </head>
    <body>${getMarkdown()}</body>
  </html>`;
  res.send(html)
}
