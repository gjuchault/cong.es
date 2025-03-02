import { expect, test } from "bun:test";
import { expandDaysOff } from "../expand-days-off"
import { Temporal } from "temporal-polyfill";

test("expandDaysOff()", () => {
  expect(expandDaysOff({
    from: Temporal.PlainDate.from("2025-02-02"),
    to: Temporal.PlainDate.from("2025-02-06"),
    fromHalfOnly: false,
    toHalfOnly: false,
    name: "test",
    type: "nMinusOne"
  })).toEqual([
    {
      date: Temporal.PlainDate.from("2025-02-02"),
      fromHalfOnly: false,
      isEnd: false,
      isStart: true,
      label: "test",
      toHalfOnly: false,
      type: "nMinusOne",
    },
    {
      date: Temporal.PlainDate.from("2025-02-03"),
      fromHalfOnly: false,
      isEnd: false,
      isStart: false,
      label: "test",
      toHalfOnly: false,
      type: "nMinusOne",
    },
    {
      date: Temporal.PlainDate.from("2025-02-04"),
      fromHalfOnly: false,
      isEnd: false,
      isStart: false,
      label: "test",
      toHalfOnly: false,
      type: "nMinusOne",
    },
    {
      date: Temporal.PlainDate.from("2025-02-05"),
      fromHalfOnly: false,
      isEnd: false,
      isStart: false,
      label: "test",
      toHalfOnly: false,
      type: "nMinusOne",
    },
    {
      date: Temporal.PlainDate.from("2025-02-06"),
      fromHalfOnly: false,
      isEnd: true,
      isStart: false,
      label: "test",
      toHalfOnly: false,
      type: "nMinusOne",
    }
  ])
});
