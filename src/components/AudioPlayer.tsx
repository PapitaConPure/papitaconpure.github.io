'use client';

import {
	faHeadphonesAlt,
	faPause,
	faPlay,
	faVolumeHigh,
	faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import {
	createContext,
	MouseEventHandler,
	PropsWithChildren,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import getRoot from '@/lib/getroot';
import { clamp, linearToExponential } from '@/lib/utils';
import { Slider } from './ui/slider';

export interface AudioPlayerTrack {
	url: string;
	format: string;
	name: string;
	external?: boolean;
}

export interface AudioPlayerTrackState {
	audioPlayerTrack: AudioPlayerTrack | null;
	setAudioPlayerTrack: (x: AudioPlayerTrack | null) => void;
	volume: number;
	setVolume: (v: number) => void;
	muted: boolean;
	setMuted: (v: boolean) => void;
}

const AudioPlayerTrackContext = createContext<AudioPlayerTrackState | null>(null);
let _setAudioPlayerTrack: ((track: AudioPlayerTrack | null) => void) | null = null;

export function AudioPlayerTrackProvider({ children }: PropsWithChildren) {
	const [audioPlayerTrack, setAudioPlayerTrack] = useState<AudioPlayerTrack | null>(null);
	const [volume, setVolumeState] = useState<number>(1);
	const [muted, setMutedState] = useState<boolean>(false);

	useEffect(() => {
		const savedVolume = localStorage?.getItem('audioPlayerVolume');
		if(savedVolume)
			setVolumeState(+savedVolume);

		const savedMuted = localStorage?.getItem('audioPlayerMuted');
		if(savedMuted)
			setMutedState(savedMuted === `${true}`);

		return () => {
			_setAudioPlayerTrack = null;
		};
	}, []);

	_setAudioPlayerTrack = setAudioPlayerTrack;

	const setVolume = (volume: number) => {
		setVolumeState(volume);
		localStorage.setItem('audioPlayerVolume', `${volume}`);
	};
	const setMuted = (muted: boolean) => {
		setMutedState(muted);
		localStorage.setItem('audioPlayerMuted', `${muted}`);
	};

	return (
		<AudioPlayerTrackContext.Provider
			value={{ audioPlayerTrack, setAudioPlayerTrack, volume, setVolume, muted, setMuted }}>
			{children}
		</AudioPlayerTrackContext.Provider>
	);
}

export function usePlayerTrack() {
	const context = useContext(AudioPlayerTrackContext);

	if (context == null)
		throw new Error('No se encontró el contexto para reproducir pistas de audio.');

	return context;
}

export function sendTrackToAudioPlayer(track: AudioPlayerTrack) {
	if (!_setAudioPlayerTrack)
		throw new Error('No se inicializó el proveedor para reproducir pistas de audio.');

	_setAudioPlayerTrack(track);
}

export function stopAudioPlayer() {
	if (!_setAudioPlayerTrack)
		throw new Error('No se inicializó el proveedor para reproducir pistas de audio.');

	_setAudioPlayerTrack(null);
}

export function AudioPlayer() {
	const [playing, setPlaying] = useState(false);
	const [openVolumeSlider, setOpenVolumeSlider] = useState(false);
	const { audioPlayerTrack, volume, setVolume, muted, setMuted } = usePlayerTrack();
	const playerRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (!playerRef.current) return;

		playerRef.current.volume = linearToExponential(volume);
		playerRef.current.muted = muted;
	}, [audioPlayerTrack, volume, muted]);

	const togglePlaying = () => {
		const wasStopped = playerRef.current?.paused || playerRef.current?.ended;

		if (wasStopped) playerRef.current?.play();
		else playerRef.current?.pause();
	};

	const toggleMuted: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();

		if (playerRef.current == null) return;

		const newMuteState = !playerRef.current?.muted;
		playerRef.current.muted = newMuteState;
		setMuted(newMuteState);
	};

	const checkPlaying = (playing: boolean) => {
		setPlaying(playing);
	};

	if (!audioPlayerTrack) return;

	return (
		<div className='group fixed bottom-6 right-2 z-50 flex min-h-12 min-w-12 max-w-[95%] items-center justify-between rounded-full border border-secondary-800 border-opacity-60 bg-background bg-opacity-10 p-2 shadow-none shadow-black outline-none ring-0 ring-primary-main backdrop-blur-md transition-all focus-within:scale-110 focus-within:bg-opacity-20 focus-within:shadow-lg hover:scale-110 hover:bg-opacity-20 hover:shadow-lg focus:ring-2 active:bg-opacity-30 sm:bottom-20 sm:right-4 md:bottom-20 md:right-8 md:inline-flex md:min-h-9 md:min-w-9 md:rounded-md'>
			<audio
				key={audioPlayerTrack.url}
				ref={playerRef}
				controls
				autoPlay
				controlsList='noremoteplayback nofullscreen'
				preload='metadata'
				className='hidden'
				onPlay={() => checkPlaying(true)}
				onPause={() => checkPlaying(false)}>
				<source
					src={
						audioPlayerTrack.external
							? audioPlayerTrack.url
							: getRoot(audioPlayerTrack.url)
					}
					type={`audio/${audioPlayerTrack.format}`}
				/>
				Your browser does not support the «audio» element.
			</audio>
			<div className='hidden md:block'>
				<Popover open={openVolumeSlider} onOpenChange={setOpenVolumeSlider}>
					<PopoverTrigger
						onMouseEnter={() => setOpenVolumeSlider(true)}
						onMouseLeave={() => setOpenVolumeSlider(false)}
						onClick={toggleMuted}
						className='after: mr-0 aspect-square w-0 max-w-max scale-y-0 justify-center rounded-full opacity-0 transition-all duration-300 group-focus-within:mr-4 group-focus-within:w-[1024px] group-focus-within:scale-y-100 group-focus-within:pl-2 group-focus-within:opacity-100 group-hover:mr-4 group-hover:w-[1024px] group-hover:scale-y-100 group-hover:pl-2 group-hover:opacity-100'>
						{muted ? (
							<FontAwesomeIcon icon={faVolumeMute} />
						) : (
							<FontAwesomeIcon icon={faVolumeHigh} />
						)}
					</PopoverTrigger>
					<PopoverContent
						onMouseEnter={() => setOpenVolumeSlider(true)}
						onMouseLeave={() => setOpenVolumeSlider(false)}
						side='top'
						className='group mb-4 ml-2 flex h-48 w-10 flex-col-reverse items-center justify-between rounded-full border border-secondary-800 border-opacity-60 bg-background bg-opacity-30 p-2 shadow-none shadow-black outline-none ring-0 ring-primary-main transition-all after:absolute after:-bottom-0.5 after:h-5 after:w-20 hover:bg-opacity-50 hover:shadow-lg focus:ring-2 active:bg-opacity-50 md:rounded-md'>
						<Slider
							orientation='vertical'
							min={0}
							max={1}
							step={0.001}
							value={[clamp(volume, 0, 1)]}
							onValueChange={([v]) => setVolume(v)}
							className='h-48 w-4'
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className='block md:hidden'>
				<button
					onClick={toggleMuted}
					className='after: mr-0 aspect-square w-0 max-w-max scale-y-0 justify-center rounded-full opacity-0 transition-all duration-300 group-focus-within:mr-4 group-focus-within:w-[1024px] group-focus-within:scale-y-100 group-focus-within:pl-2 group-focus-within:opacity-100 group-hover:mr-4 group-hover:w-[1024px] group-hover:scale-y-100 group-hover:pl-2 group-hover:opacity-100'>
					{muted ? (
						<FontAwesomeIcon icon={faVolumeMute} />
					) : (
						<FontAwesomeIcon icon={faVolumeHigh} />
					)}
				</button>
			</div>
			<div
				className={`${playing ? 'text-primary-200' : ''} mr-0 hidden w-0 max-w-max scale-x-0 cursor-pointer select-none whitespace-nowrap p-0 text-center text-sm text-foreground/80 opacity-0 transition-all duration-200 group-focus-within:mr-4 group-focus-within:w-[1024px] group-focus-within:scale-x-100 group-focus-within:pl-2 group-focus-within:opacity-100 group-hover:mr-4 group-hover:w-[1024px] group-hover:scale-x-100 group-hover:pl-2 group-hover:opacity-100 md:block`}>
				{audioPlayerTrack.name}
			</div>
			<button
				onClick={togglePlaying}
				className='aspect-square w-0 justify-center opacity-0 transition-all after:absolute after:bottom-0 after:right-0 after:h-full after:w-0 group-focus-within:mr-2 group-focus-within:w-full group-focus-within:opacity-100 group-hover:mr-2 group-hover:w-full group-hover:opacity-100 group-hover:after:w-1/2'>
				{playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
			</button>
			<button
				className={`${playing ? 'text-accent-300' : 'text-foreground/30'} absolute inset-0 flex h-full w-full scale-y-100 items-center justify-center opacity-100 transition-all group-focus-within:w-0 group-focus-within:scale-y-0 group-focus-within:opacity-0 group-hover:w-0 group-hover:scale-y-0 group-hover:opacity-0`}>
				<div>
					<FontAwesomeIcon icon={faHeadphonesAlt} />
				</div>
			</button>
		</div>
	);
}
