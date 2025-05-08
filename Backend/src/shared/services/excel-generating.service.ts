import { Injectable } from '@nestjs/common';
import * as xl from 'excel4node';
import { Response } from 'express';
@Injectable()
export class ExcelGenerating {
  private xl;
  constructor() {
    this.xl = xl;
  }

  public generate(
    headers: Record<string, string>,
    data: Record<string, any>[],
  ): (res: Response, filename: string) => void {
    const selectedKeys = Object.keys(headers);
    const wb = new this.xl.Workbook();

    let options = {
      sheetFormat: {
        baseColWidth: 40, // Defaults to 10. Specifies the number of characters of the maximum digit width of the normal style's font. This value does not include margin padding or extra padding for gridlines. It is only the number of characters.,
      },
    };
    const ws = wb.addWorksheet("Sheet 1", options);

    const style = wb.createStyle({
      font: {
        color: '#000000',
        size: 12,
      },
      numberFormat: '#,##0.00; (#,##0.00); -',
      alignment: {
        horizontal: 'center'
      }
    });

    selectedKeys.forEach((key, i) => {
      ws.cell(1, i + 1)
        .string(headers[key])
        .style(style);
    });

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < selectedKeys.length; j++) {
        const currentItem = data[i][selectedKeys[j]];

        if (currentItem === true) {
          ws.cell(i + 2, j + 1)
            .string('نعم')
            .style(style);
        } else if (currentItem === false) {
          ws.cell(i + 2, j + 1)
            .string('لا')
            .style(style);
        } else if (currentItem instanceof Date) {
          ws.cell(i + 2, j + 1)
            .string(Intl.DateTimeFormat('ar-SA').format(currentItem))
            .style(style);
        } else if (typeof currentItem == typeof 0) {
          ws.cell(i + 2, j + 1)
            .number(currentItem)
            .style(style);
        } else if (currentItem == 'TRANSACTION') {
          ws.cell(i + 2, j + 1)
            .string('معاملات')
            .style(style);
        } else if (currentItem == 'TRANSPORT') {
          ws.cell(i + 2, j + 1)
            .string('مواصلات')
            .style(style);
        } else if (currentItem == 'FORSA') {
          ws.cell(i + 2, j + 1)
            .string('اشتراك')
            .style(style);
        } else if (currentItem == 'PENALTY') {
          ws.cell(i + 2, j + 1)
            .string('العقوبات')
            .style(style);
        } else
          ws.cell(i + 2, j + 1)
            .string(data[i][selectedKeys[j]] || '')
            .style(style);
      }
    }

    return (res: Response, filename: string): void => {
      wb.write(`${filename}.xlsx`, res);
      return;
    };
  }
}
