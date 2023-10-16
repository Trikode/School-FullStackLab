export default function Footer() {
  return (
    <div className="Flex Column Center Footer">
      <div className="Full Flex Sections">
        <div
          className="Flex Column StartLeft FooterCard"
          style={{
            gap: '1rem'
          }}>
          <p className="Bold Big">MySchool</p>
          <p className="Mid">🏫</p>
        </div>
        <div
          className="Flex Column StartLeft FooterCard"
          style={{ gap: '1rem' }}>
          <p className="Mid Bold">Find us</p>
          <p className="Mid">Piazzale Cantore, 10</p>
          <p className="Mid">20123, Milano MI</p>
        </div>
        <div
          className="Flex Column StartLeft FooterCard"
          style={{ gap: '1rem' }}>
          <p className="Mid Bold">Contacts</p>
          <p className="Mid">info@School.it</p>
          <p className="Mid">+39 333 546 3442</p>
        </div>
      </div>
      <div
        className="Full Flex Center SecondaryText"
        style={{
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
        <p className="Small onHover" style={{ width: '8rem' }}> Cookie Policy </p>
        <p className="Small onHover" style={{ width: '8rem' }}> &#169; 2023 </p>
        <p className="Small onHover" style={{ width: '8rem' }}> Privacy Policy </p>
      </div>
    </div>
  );
}