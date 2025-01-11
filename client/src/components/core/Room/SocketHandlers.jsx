import { diff_match_patch } from 'diff-match-patch';

export const setupSocketHandlers = (socket, {
    name,
    roomid,
    code,
    language,
    token,
    input,
    output,
    avatar,
    setCode,
    setLanguage,
    setInput,
    setOutput,
    setInRoomUsers,
    EditorRef,
    inRoomUsers,
    setQuestions,
    setOverallFeedback,
    toast,
}) => {
    const dmp = new diff_match_patch();
    let lastSyncedCode = code;
    let isLocalChange = false;
    let isFirstJoin = true;

    socket.on('connect', () => {
        console.log('Connected');
    });

    socket.emit('join', {
        name,
        roomid,
        code,
        language,
        token,
        input,
        output,
        avatar
    });

    socket.on('join', (msg, room) => {
        console.log("join gave me this data\n", room, "\n");
        toast(msg);

        if (isFirstJoin) {
            lastSyncedCode = room.code;
            setCode(room.code);
            setLanguage(room.language);
            setInput(room.input);
            setOutput(room.output);
            isFirstJoin = false;
        }

        setInRoomUsers(room.users);
        socket.off('join');
    });

    socket.on('userJoin', ({ msg, newUser }) => {
        const arr = [newUser, ...inRoomUsers];
        setInRoomUsers(arr);
        toast.success(msg);
    });

    socket.on('userLeft', ({ msg, userId }) => {
        const arr = inRoomUsers.filter(user => user.id !== userId);
        setInRoomUsers(arr);
        toast.error(msg);
    });

    socket.on('update', ({ patch, senderId }) => {
        if (isLocalChange) {
            isLocalChange = false;
            return;
        }

        const editor = EditorRef.current?.editor;
        if (!editor) return;

        const currentCode = editor.getValue();
        const cursorPosition = editor.getCursorPosition();
        const selection = editor.getSelection();

        try {
            // Apply the patch to lastSyncedCode instead of current code
            const [newCode, results] = dmp.patch_apply(patch, lastSyncedCode);

            if (results[0]) {
                // Calculate line and column differences
                const oldLines = lastSyncedCode.split('\n');
                const newLines = newCode.split('\n');
                const currentLine = oldLines[cursorPosition.row] || '';
                const newLine = newLines[cursorPosition.row] || '';

                // Update the reference code
                lastSyncedCode = newCode;
                setCode(newCode);

                // Adjust cursor position based on line changes
                const newPosition = {
                    row: Math.min(cursorPosition.row, newLines.length - 1),
                    column: Math.min(cursorPosition.column, newLine.length)
                };

                // Use setTimeout to ensure the editor has updated
                setTimeout(() => {
                    if (editor) {
                        editor.moveCursorToPosition(newPosition);
                        if (!selection.isEmpty()) {
                            editor.clearSelection();
                        }
                    }
                }, 0);
            } else {
                console.error('Failed to apply patch, requesting full room data');
                socket.emit('getRoom', { roomid });
            }
        } catch (error) {
            console.error('Error applying patch:', error);
            socket.emit('getRoom', { roomid });
        }
    });

    socket.on('getRoom', ({ room }) => {
        if (!isFirstJoin) {
            lastSyncedCode = room.code;
            setCode(room.code);
            setLanguage(room.language);
            setInput(room.input);
            setOutput(room.output);
        }
    });

    socket.on('updateIO', ({ newinput, newoutput, newlanguage }) => {
        setLanguage(newlanguage);
        setInput(newinput);
        setOutput(newoutput);
    });

    socket.on('updateOutput', ({ newOutput }) => {
        setOutput(newOutput);
    });

    socket.on('error', ({ error }) => {
        console.error('Socket error:', error);
        toast.error('Connection error occurred');
    });
};

export const leaveRoom = (socket, roomid, navigate) => {
    socket.emit('leave', { roomid });
    socket.off();
    navigate('/');
};