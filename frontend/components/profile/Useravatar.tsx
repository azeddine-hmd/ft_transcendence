export default function Useravatar({avata,userid}:any) {
    return (
        <div className="iconuser  flex w-full justify-end ">
        <div className="user w-[300px] h-[70px] flex  items-center rounded-[16px] bg-[#513f90]">
            <div className="elauser w-full flex px-2 pr-3 items-center justify-center">
                 <div className="avataru flex items-center ">
                    <div className="a w-[52px] min-w-[48px]">
                        <img src={avata} className={`rounded-[50%] shadow-2xl`}  alt="" />
                    </div>
                    <h1 className="text-[#fff] px-3">{userid}</h1>
                </div>
                <div className="selec">
                    <img src="/profile/Menu Button.png" className="w-[22px] cursor-pointer" alt="" />
                </div>
            </div>
        </div>
        </div>
    );
}