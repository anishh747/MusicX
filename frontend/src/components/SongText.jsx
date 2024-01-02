import React from 'react'


const SongText = (props) => {
    const title = String(props.title);
    return (
        <h3>
            {props.card && title.length > 14 ? (
                <span
                    className={`text-${props.mode}`}
                    dangerouslySetInnerHTML={{
                        __html: `${title.slice(0, 14)}...`,
                    }
                    }
                >
                </span>
            ) : (
                <span
                    className={`text-${props.mode}`}
                    dangerouslySetInnerHTML={{
                        __html: `${title}`,
                    }}
                />
            )}
        </h3>
    )
}

export default SongText