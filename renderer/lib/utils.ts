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

    // If showMessages is not provided, then we assume we should
    if (opts?.showMessages ?? true) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const stdReply = error.response.data;
          toast.error(stdReply.clientMessage ?? "An error occurred!");
        } else {
          toast.error(error.code ?? "An error occurred!!");
        }
      } else {
        console.log(error);
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
    {
      showMessages: showMessages,
    }
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

export function formatTimeDuration(durationInMs: number) {
  if (durationInMs < 1000) {
    return `${durationInMs}ms`;
  } else if (durationInMs < 60000) {
    return `${Math.floor(durationInMs / 1000)}s`;
  } else if (durationInMs < 3600000) {
    return `${Math.floor(durationInMs / 60000)}m`;
  } else if (durationInMs < 86400000) {
    return `${Math.floor(durationInMs / 3600000)}h`;
  } else {
    return `${Math.floor(durationInMs / 86400000)}d`;
  }
}

const gradients: string[] = [
  "linear-gradient(to right, #f44336, #e91e63, #d81b60)",
  "linear-gradient(to right, #ff9800, #ff7f0e, #ff6f0d)",
  "linear-gradient(to right, #ffeb3b, #ffc107, #ffb706)",
  "linear-gradient(to right, #55acee, #66c0f5, #77d0f9)",
  "linear-gradient(to right, #0079c0, #38ef7d, #79f6ae)",
  "linear-gradient(to right, #29b6f6, #4fc3f7, #79d2f8)",
  "linear-gradient(to right, #ff1744, #ff0e66, #ff008d)",
  "linear-gradient(to right, #f4511e, #ee6969, #d8877a)",
  "linear-gradient(to right, #4caf50, #85d35b, #c0e15d)",
  "linear-gradient(to right, #f0ad4e, #ff7f0e, #ff5200)",
];

function hashGradient(string: string): number {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = hash * 31 + string.charCodeAt(i);
  }
  return hash % gradients.length;
}

export function getGradient(string: string) {
  return gradients[hashGradient(string)];
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
}
