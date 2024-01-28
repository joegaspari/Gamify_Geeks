import React from 'react';
import Success from './icon/status/Success'
import Loading from './icon/status/Loading'
import Failure from './icon/status/Failure'

const darkColors = ['#04BD00', '#1A8CE0', '#DE1D1D']
const lightColors = ['#EBFEE9', '#E9F5FE', '#FEE9E9']
const icons = [<Success/>, <Loading/>, <Failure/>]

export default function Toast({ status, title, subTitle }) {

    const toastStyle = {
        backgroundColor: lightColors[status],
        color: '#141414',
        borderRadius: '10px',
        border: `1px solid ${darkColors[status]}`,
    }

    return (
        <div className="h-[80px] w-[480px] p-[10px] flex flex-row" style={toastStyle}>
            <div className='w-[2px] h-[60px] bg-bgGreen1 grow-0' style={{backgroundColor: darkColors[status]}}/>
            <div className='grow h-[60px] p-[10px] pl-[20px] flex flex-row gap-[10px]'>
                <div className='h-[40px] w-[40px] aspect-square flex justify-center items-center'>
                    {icons[status]}
                </div>
                <div className='w-full h-full justify-between flex flex-col'>
                    <h2 className='text-xl leading-5 font-semibold'>{title}</h2>
                    <p className='text-sm leading-[14px]'>{subTitle}</p>
                </div>
            </div>
        </div>
    );
}