import { FC, memo } from "react";
import Heading from "../common/Heading";
import dayjs from "dayjs";

type Props = { arrayDataUsage?: number[]; dataUsage: number };
export const KeyDataUseage: FC<Props> = memo(
  ({ arrayDataUsage, dataUsage }) => {
    // console.log("arrayDataUsage ~ ", arrayDataUsage);
    if (!arrayDataUsage) return;
    if (arrayDataUsage) {
      const arrayDataUsageTransform: (number | null)[] = [
        ...arrayDataUsage.reverse(),
        ...new Array(30 - arrayDataUsage.length).fill(null),
      ];
      // console.log("arrayDataUsageTransform ~ ", arrayDataUsageTransform);
      return (
        <div className="space-y-10">
          <Heading>Data 30 days useage</Heading>
          <div className="overflow-x-scroll pb-5">
            {/* <div className="w-[900px] lg:w-full grid grid-cols-12">
            {arrayDataUsageTransform.map((item, index) => (
              <div className="col-span-1" key={index}>{dayjs().subtract(index, 'day').format('DD/MM')}</div>
            ))}
          </div> */}
            <table className="border border-black border-solid">
              <thead>
                <tr>
                  <th className="font-bold text-left text-sm px-3 border border-black border-solid py-2">
                    Date
                  </th>
                  {arrayDataUsageTransform.map((_, index) => (
                    <th
                      className="font-normal text-sm text-left px-3 py-2 border border-black border-solid"
                      key={index}
                    >
                      {dayjs()
                        .subtract(index + 1, "day")
                        .format("DD/MM")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="font-bold text-sm px-3 text-left border border-black border-solid">
                    Count
                  </th>
                  {arrayDataUsageTransform.map((_, index) => (
                    <td
                      className="text-sm px-3 py-2 border border-black border-solid"
                      key={index}
                    >
                      {/* {index > 0 ? `D${index - 1}` : "Hôm qua"} */} D
                      {index + 1}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="font-bold text-sm px-3 text-left border border-black border-solid">
                    Usage
                  </th>
                  {arrayDataUsageTransform.map((item, index) => (
                    <td
                      className="text-sm px-3 py-2 border border-black border-solid"
                      key={index}
                    >
                      {item
                        ? `${(item / 1000 / 1000 / 1000).toFixed(2)}GB`
                        : item === 0
                        ? "0GB"
                        : "NA"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="font-bold text-sm px-3 text-left border border-black border-solid">
                    Datausage
                  </th>
                  <td className="text-sm px-3 py-2 border border-black border-solid font-semibold">
                    {(dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB
                  </td>
                  {arrayDataUsageTransform?.[0] && (
                    <td
                      colSpan={3}
                      className="text-sm px-3 py-2 border border-black border-solid font-semibold"
                    >
                      Yesterday:{" "}
                      {(
                        arrayDataUsageTransform?.[0] /
                        1000 /
                        1000 /
                        1000
                      ).toFixed(2)}
                      GB
                    </td>
                  )}

                  <td
                    colSpan={3}
                    className="text-sm px-3 py-2 border border-black border-solid font-semibold"
                  >
                    Last 30:{" "}
                    {arrayDataUsageTransform[29]
                      ? `${(
                          arrayDataUsageTransform[29] /
                          1000 /
                          1000 /
                          1000
                        ).toFixed(2)}GB`
                      : "NA"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
);
