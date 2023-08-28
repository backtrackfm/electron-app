import axios, { AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function api(path: string) {
  return `http://localhost:4000/api${path}`;
}

type PrepareOpts = {
  successFn: () => any;
  showMessages: boolean;
};

export async function prepare(
  fn: () => Promise<AxiosResponse>,
  opts?: Partial<PrepareOpts>
): Promise<AxiosResponse> {
  try {
    const res = await fn();
    // if we get here, we know it's a success
    if (opts && opts.successFn) {
      opts.successFn();
    }

    return res;
  } catch (error) {
    // check if the error was thrown from axios
    console.log(error);

    // If showMessages is not provided, then we assume we should
    if (opts && opts.showMessages) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const stdReply = error.response.data;
          toast.error(stdReply.clientMessage ?? "An error occurred!");
        } else {
          toast.error(error.code ?? "An error occurred!!");
        }
      } else {
        toast.error("An error occurred!!!");
      }
    }

    return null;
  }
}

export const fetcher = async (url: string, showMessages: boolean = true) =>
  prepare(
    () =>
      axios
        .get(url, {
          withCredentials: true,
        })
        .then((res) => res.data),
    {}
  );

export function formatDate(date: Date): string {
  const month = date.getMonth() + 1; // Months are 0-indexed, so we add 1
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

const colors = [
  "bg-lime-500",
  "bg-cyan-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
];

export function getStringColor(input: string): string {
  const hash = input.split("").reduce((acc, char) => {
    return (acc + char.charCodeAt(0)) % colors.length;
  }, 0);

  return colors[hash];
}
