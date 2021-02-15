describe('user login', () => {
    it('Test for Sign In', () => {
      cy.request('http://localhost:3000/login')
      cy.visit('/login')
      cy.get('#email').type('admin@admin.com')
      cy.get('#password').type('admin123')
      
      cy.get('.ant-form-item-children > div > .ant-btn').click()
      
    })
  })
  