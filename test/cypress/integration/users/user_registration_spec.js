//create random email
function randomEmail(domain) {
  var chars = 'abcdefghijklmnopqrstuvwzyx123456789'
  var result = chars[Math.floor(Math.random() * 26)] + Math.random().toString(36).substring(2, 11) + '@' + domain
  return result
}
describe('user register', () => {
  it('shows the courses', () => {
    cy.request('http://localhost:3000/register')
    cy.visit('/register')
    cy.get('#name').type('Jonah').should('have.value', 'Jonah')
    cy.get('#lastName').type('Müller')
    var testEmail = randomEmail('user.com')
    cy.get('#email').type(testEmail)
    cy.get('#password').type('johan123')
    cy.get('#confirmPassword').type('johan123')
    cy.get('.ant-form-item-children > .ant-btn').click()
  })
})
