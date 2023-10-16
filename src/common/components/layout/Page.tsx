
export const Page: React.FC<WithChildren> = ({ children }) => 
  <div style={{height: '100vh', width: '100vw'}}>
    {children}
  </div>
// z heccrbq!!!
const Страничка = ({ children }: WithChildren) => {
  return (
    <main className='page'>
      {children}
    </main>
  )
}


const Тело = ({ children }: WithChildren) => 
  <div 
    className="page_body"
  >
    {children}
  </div>

Страничка.Тело = Тело;
export default Страничка;