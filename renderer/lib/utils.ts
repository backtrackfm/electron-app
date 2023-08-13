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

export async function prepare(
  fn: () => Promise<AxiosResponse>,
  successFn?: () => any
): Promise<AxiosResponse> {
  try {
    const res = await fn();
    // if we get here, we know it's a success
    if (successFn) {
      successFn();
    }

    return res;
  } catch (error) {
    // check if the error was thrown from axios
    console.log(error);

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

    return null;
  }
}

// export async function prepare(
//   apiCall: () => Promise<StdReply>,
//   successFn?: () => unknown
// ) {
//   try {
//     // do what you want with axios
//     // axios.get('https://example.com/some-api');
//     const res = await apiCall();
//     successFn();
//     return apiCall();
//   } catch (error) {
//     // check if the error was thrown from axios
//     if (axios.isAxiosError(error)) {
//       // do something
//       // or just re-throw the error
//       // throw error;
//       console.log(error);
//       if (error.response) {
//         const stdReply = error.response.data;
//         toast.error(stdReply.clientMessage ?? "An error occurred");
//       } else {
//         toast.error(error.code ?? "An error occurred");
//       }
//     } else {
//       // do something else
//       // or creating a new error
//       // throw new Error("different error than axios");
//       toast.error("An error occurred");
//     }

//     return null;
//   }
// }
