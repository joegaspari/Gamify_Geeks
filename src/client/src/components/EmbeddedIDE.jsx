import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';

import SelectBox from './InputBox/Select/SelectBox';
import LockedSelectBox from './InputBox/Select/LockSelectBox';
import ResetTimeIcon from './icon/ResetTimeIcon';
import Save from './icon/Save';
import Tooltip from './Tooltip';

export default function EmbeddedIDE({ 
  
  languages,
  difficulties, 
  question,

  handleLanguageChange, 
  handleDifficultyChange, 
  
  language,
  codeMirrorLanguage,
  difficulty,
  setCode,
  code, 
  openConfirmReset,

  handleGenerateQuestion,
  handleSaveAnswer,
  isLoading,
  modifiable,
}) {

  const [buttonsEnabled, setButtonsEnabled] = useState(true)
  
  useEffect(() => {
    setButtonsEnabled(() => {
      return question != null
    })
  }, [question]);

  const editorViewCSS = EditorView.theme({
    '&': {
      overflow: 'hidden',
      fontSize: '18px',
    },
    '.cm-gutters': {
      borderRight: 'solid 2px',
      borderColor: '#d9d9d9',
    },
    '.cm-gutterElement': {
      padding: '0 5px',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 1px 0 10px',
    },
    '.cm-selectionMatch': {
      boxShadow: 'inset 0 0 0 1px #c8c8c8',
    },
  });

  const theme = createTheme({
    theme: 'light',
    settings: {
      fontFamily: "'Poppins', sans-serif",
      background: '#ffffff',
      foreground: '#141414',
      caret: '#141414',
      selection: '#ebf7ff', // TODO
      selectionMatch: '#ebf7ff', // TODO
      lineHighlight: '#ebf7ff',
      gutterBackground: '#fafafa',
      gutterForeground: '#787878',
      gutterBorder: '#d9d9d9',
    },
    styles: [
      { tag: t.comment, color: '#787878' },
      { tag: t.keyword, color: '#04bd00' },

      { tag: t.special(t.string), color: '#974949' },

      { tag: t.function(t.variableName), color: '#1a8ce0' },
      { tag: t.function(t.propertyName), color: '#1a8ce0' }, // function calls
    ],
  });

  return (
    <div className="grow w-full rounded-2xl overflow-hidden relative shadow-xl bg-white">
      <div className="flex justify-between items-center sm:h-[90px] h-[150px] p-5 bg-offWhite2 border-b-2 border-white3 gap-5">
        <div className="sm:h-10 h-full flex justify-between items-center gap-5 top-5 right-5 w-full">
          <div className="flex sm:w-[100px] w-10 h-full sm:flex-row flex-col gap-5">
          <button
            data-tooltip-id="resetBtn-tooltip"
            id='resetBtn'
            className={` ${!(buttonsEnabled && code != "") && "relative disabled"}
                  h-full
                  border 
                  border-black2 
                  rounded-lg
                  bg-white1 
                  aspect-square 
                  flex justify-center 
                  items-center 
                  hover:scale-110 active:bg-white3
                  transition-all duration-150
                  cursor-pointer
                `}
                onClick={!(buttonsEnabled && code != "") ? () => {} : () => openConfirmReset()}
              >
            <ResetTimeIcon />
          </button>
          <button
            data-tooltip-id="saveBtn-tooltip"
            id='saveBtn'
            className={` ${!(buttonsEnabled && code != "") && "relative disabled"}
                  h-full
                  border 
                  border-black2 
                  rounded-lg 
                  bg-white1 
                  aspect-square 
                  flex justify-center 
                  items-center 
                  hover:scale-110 active:bg-white3 
                  transition-all duration-150
                  cursor-pointer
                  `}
                onClick={!(buttonsEnabled && code != "") ? () => {} : handleSaveAnswer}
              >
            <Save />
          </button>
          </div>
          <div className="w-full h-full flex flex-col sm:flex-row gap-5">
            <div className="h-full flex gap-5 justify-center">
              <div className="sm:w-40 w-full">
                {(languages && languages.length != 0) && 
                  ( modifiable ? (
                      <SelectBox options={languages} title="Language" handleOption={handleLanguageChange} initialOption={language} />
                    ) : (
                      <LockedSelectBox title="Language" value={(languages.find((item) => item.id == language)).name}/>
                    )
                  )
                }
              </div>
              <div className="sm:w-40 w-full">
                {(difficulties && difficulties.length != 0) && 
                  ( modifiable ? (
                      <SelectBox options={difficulties} title="Difficulty" handleOption={handleDifficultyChange} initialOption={difficulty} />
                    ) : (
                      <LockedSelectBox title="Difficulty" value={(difficulties.find((item) => item.id == difficulty)).name}/>
                    )
                  )
                }
              </div>
            </div>
            {
              modifiable && 
              <button
                id="generateBtn"
                onClick={handleGenerateQuestion}
                disabled={!modifiable}
                className={`
                  w-full h-full grow bg-bgGreen1 rounded-lg font-semibold text-white text-lg 
                  duration-150 active:bg-green-700
                  ${isLoading ? 'opacity-50 cursor-not-allowed':'hover:scale-105'}
                `}
                >
                {isLoading ? 'Loading...' : 'Generate'}
              </button>
            }
          </div>
        </div>
        

      </div>
      <CodeMirror
        value={code}
        height="70vh"
        extensions={[theme, editorViewCSS, codeMirrorLanguage || javascript()]}
        onChange={setCode}
      />
      <Tooltip 
        id="saveBtn" 
        tooltip={
          <div className='p-[1px] bg-black2 rounded-lg shadow-standard'>
            <div className='bg-white1 px-3 py-2 text-black1 text-sm rounded-lg'>
              <p>{(buttonsEnabled && code != "") ? "Save Answer" : "Disabled"}</p>
            </div>
          </div>
        }
        offset={10}
        place='bottom'
      />
      <Tooltip 
        id="resetBtn" 
        tooltip={
          <div className='p-[1px] bg-black2 rounded-lg shadow-standard'>
            <div className='bg-white1 px-3 py-2 text-black1 text-sm rounded-lg'>
              <p>{(buttonsEnabled && code != "") ? "Reset Answer" : "Disabled"}</p>
            </div>
          </div>
        }
        offset={10}
        place='bottom'
      />
    </div>
  );
}
