import React from 'react';
import { FaPlay } from 'react-icons/fa';

const Settings = ({
    setLanguage,
    setTheme,
    setFontSize,
    setFontFamily,
    language,
    theme,
    fontSize,
    fontFamily,
    run,
    handleLangChange,
    running
}) => {
    return (
        <div className=" text-white flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="min-w-[120px] sm:min-w-[140px]">
                    <label className="block text-xs text-gray-400 mb-1">Language</label>
                    <select
                        value={language}
                        onChange={(e) => handleLangChange(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#1A1A2E]/80 border border-[#533483]/30 rounded-lg text-white/90 text-sm focus:outline-none focus:border-[#533483] transition-colors"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c_cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="golang">Go</option>
                        <option value="rust">Rust</option>
                    </select>
                </div>

                <div className="min-w-[120px] sm:min-w-[140px]">
                    <label className="block text-xs text-gray-400 mb-1">Theme</label>
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#1A1A2E]/80 border border-[#533483]/30 rounded-lg text-white/90 text-sm focus:outline-none focus:border-[#533483] transition-colors"
                    >
                        <option value="monokai">Monokai</option>
                        <option value="github">Github</option>
                        <option value="cobalt">Cobalt</option>
                        <option value="dracula">Dracula</option>
                        <option value="terminal">Terminal</option>
                        <option value="tomorrow_night">Tomorrow Night</option>
                        <option value="vibrant_ink">Vibrant Ink</option>
                        <option value="one_dark">One Dark</option>
                    </select>
                </div>

                <div className="min-w-[120px] sm:min-w-[140px]">
                    <label className="block text-xs text-gray-400 mb-1">Font Family</label>
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#1A1A2E]/80 border border-[#533483]/30 rounded-lg text-white/90 text-sm focus:outline-none focus:border-[#533483] transition-colors"
                    >
                        <option value="monospace">Monospace</option>
                        <option value="Fira Code">Fira Code</option>
                        <option value="Source Code Pro">Source Code Pro</option>
                        <option value="Ubuntu Mono">Ubuntu Mono</option>
                    </select>
                </div>

                <div className="min-w-[100px] sm:min-w-[120px]">
                    <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                    <select
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 bg-[#1A1A2E]/80 border border-[#533483]/30 rounded-lg text-white/90 text-sm focus:outline-none focus:border-[#533483] transition-colors"
                    >
                        {[14, 16, 18, 20, 22, 24].map((size) => (
                            <option key={size} value={size}>{size}px</option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={run}
                disabled={running}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${running
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    } text-white shadow-lg`}
            >
                <FaPlay className={`${running ? 'animate-spin' : ''}`} />
                {running ? 'Running...' : 'Run Code'}
            </button>
        </div>
    );
};

export default Settings;