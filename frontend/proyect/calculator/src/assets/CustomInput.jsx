import './CustomInput.css'
export function CustomInput({ title },defaultVaule) {
    return (

        <div>
            <label className='label-method'>
                {title}
            </label>
            <input className="input-function" defaultValue={defaultVaule} ></input>
        </div>

    )
}