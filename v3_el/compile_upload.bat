@echo off

set COMPRESSED_FILE_NAME=dormitory_management_v3_el.zip
set REMOTE_SERVER=8.136.123.102
set REMOTE_USER=ecs-user
set REMOTE_DIR=/home/ecs-user/ws/dormitory_management/
set PRIVATE_KEY_PATH=D:\document\ebook\server\yuanmaxuexi.ppk
set PSCP_PATH=D:\software\putty\pscp.exe
set PLINK_PATH=D:\software\putty\plink.exe
set REMOTE_SCRIPT_PATH=/home/ecs-user/ws/dormitory_management/dormitory_management_v3_el.sh

if exist %COMPRESSED_FILE_NAME% (
    echo Found %COMPRESSED_FILE_NAME%, deleting...
    del %COMPRESSED_FILE_NAME%
    if %errorlevel% equ 0 (
        echo %COMPRESSED_FILE_NAME% deleted successfully.
    ) else (  
        echo Failed to delete %COMPRESSED_FILE_NAME%.
    )
) else (
    echo %COMPRESSED_FILE_NAME% does not exist.
)

npm run build-prod && 7z.exe a -tzip %COMPRESSED_FILE_NAME% ./dist/* && %PSCP_PATH% -scp -i %PRIVATE_KEY_PATH% %COMPRESSED_FILE_NAME% %REMOTE_USER%@%REMOTE_SERVER%:%REMOTE_DIR% && plink.exe -ssh -i "%PRIVATE_KEY_PATH%" -batch ecs-user@8.136.123.102 "sh %REMOTE_SCRIPT_PATH%"

exit