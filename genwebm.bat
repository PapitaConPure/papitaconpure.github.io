@echo off
setlocal

:: Small ffmpeg video-to-optimized-webm batch script written mostly by ChatGPT
:: Used to generate previews for various parts of the website (at the moment of writing, only for music details video downloads)

:: --- Configuration ---
:: Check if an argument was passed
if "%~1"=="" (
    echo.
    echo ERROR: No input file specified!
    echo Usage: %~nx0 ^<input_filename.mov^> [output_filename.webm]
    echo Example: %~nx0 my_video.mov
    echo Example: %~nx0 my_video.mov output.webm
    echo.
    exit /b 1
)

set "INPUT_FILE=%~1"
set "OUTPUT_FILE="

:: Check if a second argument (output file) was passed
if not "%~2"=="" (
    set "OUTPUT_FILE=%~2"
) else (
    :: Derive output filename from input filename if not provided
    for %%f in ("%INPUT_FILE%") do (
        set "OUTPUT_FILE=%%~nf.webm"
    )
)

set "VIDEO_BITRATE=250K"
set "VIDEO_SCALE=-2:480"
set "VIDEO_FPS=15"

:: --- Derived Variable (DO NOT CHANGE) ---
set "NULL_OUTPUT=NUL"
if "%OS%"=="Windows_NT" (
    set "NULL_OUTPUT=NUL"
) else (
    :: For Git Bash / WSL / MinGW environments (if running a .bat from there)
    set "NULL_OUTPUT=/dev/null"
)

:: --- Conditional FPS parameter ---
set "FPS_PARAM="
if not "%VIDEO_FPS%"=="" (
    set "FPS_PARAM=-r %VIDEO_FPS%"
)

echo.
echo Starting FFmpeg Two-Pass Conversion...
echo Input: %INPUT_FILE%
echo Output: %OUTPUT_FILE%
echo Video Bitrate: %VIDEO_BITRATE%
echo Resolution: %VIDEO_SCALE%
echo.

:: --- First Pass ---
echo Running First Pass... (Analyzing video, no output file generated)
ffmpeg -i "%INPUT_FILE%" -vf "scale=%VIDEO_SCALE%" %FPS_PARAM% -c:v libvpx-vp9 -b:v %VIDEO_BITRATE% -pass 1 -an -f webm %NULL_OUTPUT%

if %errorlevel% neq 0 (
    echo.
    echo ERROR: First pass failed!
    exit /b %errorlevel%
)
echo First Pass Complete.

echo.

:: --- Second Pass ---
echo Running Second Pass... (Encoding final video)

ffmpeg -i "%INPUT_FILE%" -vf "scale=%VIDEO_SCALE%" %FPS_PARAM% -c:v libvpx-vp9 -b:v %VIDEO_BITRATE% -pass 2 -an "%OUTPUT_FILE%"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Second pass failed!
    exit /b %errorlevel%
)
echo Second Pass Complete.

echo.

:: --- Cleanup Log Files ---
echo Cleaning up temporary log files...
del "ffmpeg2pass-0.log" 2>nul
del "ffmpeg2pass-0.log.temp" 2>nul
echo Cleanup Complete.

echo.
echo Conversion Finished! Your optimized video is: %OUTPUT_FILE%
echo.

endlocal
