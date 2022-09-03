import { useAppContext } from "../context/appContext"
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {
    const { numPages, page, changePage } = useAppContext()

    const pages = Array.from({length:numPages},(_,index)=>{
        return index + 1
    })

    const prevPage = () => {
        // console.log('prev page')
        let newPage = page - 1
        if(newPage < 1){
            newPage = numPages
        }
        changePage(newPage)
    }

    const nextPage = () => {
        // console.log('next page')
        let newPage = page + 1
        if(newPage > numPages){
            newPage = 1
        }
        changePage(newPage)
    }
    
    return <Wrapper>
        <button className="prev-btn" onClick={prevPage}>
            <HiChevronDoubleLeft/>
            prev
        </button>
        <div className="btn-container">
            {pages.map((pageNumber)=>{
                return <button key={pageNumber} type="button" className={page === pageNumber ? 'pageBtn active' : 'pageBtn'} onClick={()=>changePage(pageNumber)}>
                    {pageNumber}
                </button>
            })}
        </div>
        <button className="next-btn" onClick={nextPage}>
            next
            <HiChevronDoubleRight/>
        </button>
    </Wrapper>
}

export default PageBtnContainer