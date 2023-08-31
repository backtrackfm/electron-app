"use client";

import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface PlaybarProps extends React.HTMLAttributes<HTMLDivElement> {
  audioURL: string;
}

export default function Playbar({ audioURL }: PlaybarProps) {
  const [playing, setPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const timeUpdateHandler = () =>
      setElapsedTime(audioRef.current?.currentTime ?? 0);
    const playHandler = () => setPlaying(true);
    const pauseHandler = () => setPlaying(false);
    const volumeChangeHandler = () => setVolume(audioRef.current?.volume ?? 0);

    audioRef.current?.addEventListener("timeupdate", timeUpdateHandler);
    audioRef.current?.addEventListener("play", playHandler);
    audioRef.current?.addEventListener("pause", pauseHandler);
    audioRef.current?.addEventListener("volumechange", volumeChangeHandler);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", timeUpdateHandler);
      audioRef.current?.removeEventListener("play", playHandler);
      audioRef.current?.removeEventListener("pause", pauseHandler);
      audioRef.current?.removeEventListener(
        "volumechange",
        volumeChangeHandler
      );
    };
  }, [audioRef]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = audioURL;
    audioRef.current.play();
    audioRef.current.currentTime = 0;
    setElapsedTime(0);
    setPlaying(true);
  }, [audioURL]);

  const handlePlayPause = () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    if (audioElement.paused) {
      console.log(audioElement);
      audioElement.play();
      setPlaying(true);
    } else {
      audioElement.pause();
      setPlaying(false);
    }
  };

  console.log(audioURL);

  return (
    <div className="h-20 w-4/5 max-w-[calc(100vw-300px)] border-t absolute right-0 bottom-0 px-4 py-2 flex justify-center">
      <audio ref={audioRef}>
        <source type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="inline-flex flex-col align-center justify-center gap-4 w-1/2">
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              handlePlayPause();
            }}
            disabled={!audioURL}
          >
            {playing ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
        <Slider
          disabled={!audioURL}
          value={[elapsedTime]}
          min={0}
          max={audioRef.current?.duration ?? 100}
          onValueChange={(val) => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = val[0] ?? 0;
          }}
        />
      </div>

      <div className="flex gap-4 px-4 py-2 w-48 items-center">
        <Volume2 className="w-4 h-4" />
        <Slider
          value={[audioRef.current?.volume * 100 ?? 0]}
          min={0}
          max={100}
          onValueChange={(val) => {
            if (!audioRef.current) return;
            audioRef.current.volume = val[0] / 100;
          }}
        />
      </div>
    </div>
  );
}
