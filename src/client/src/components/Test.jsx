import React, { useEffect } from 'react';

const Test = (props) => {
    console.log("test: ", window.location.href);
    useEffect(() => {
        // 쿼리 매개변수 추출
        const params = new URLSearchParams(location.search);
        const title = params.get('title');
        const level = params.get('level');
        // 쿼리 매개변수에 따른 작업 수행
        // ...
    
        // 예: 쿼리 매개변수에 따라 다른 렌더링을 수행하거나 상태를 업데이트할 수 있습니다.
    
    }, [location.search]);

    return (
        <div>
            {window.location.href}
            {title}
            {level}
        </div>
    )
}

export default Test;