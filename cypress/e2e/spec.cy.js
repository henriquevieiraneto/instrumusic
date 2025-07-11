// cypress/e2e/instrumusic.cy.js

describe('Instrumusic - Testes E2E', () => {
  beforeEach(() => {
    cy.visit('https://henriquevieiraneto.github.io/instrumusic/')
  })

  it('Teste 1: Elementos principais visíveis', () => {
    cy.contains('InstruMusic: Aprenda, Crie, Transforme!').should('be.visible')
    cy.contains('Comece a Aprender').should('be.visible')
    cy.contains('Aulas Gratuitas').should('be.visible')
    cy.contains('Instrumentos Disponíveis').should('be.visible')
    cy.contains('Aulas Personalizadas').should('be.visible')
    cy.contains('Comunidade Vibrante').should('be.visible')
  })

  it('Teste 2: Navegação pelos menus', () => {

    cy.contains('Instrumentos').click()
    cy.url('https://henriquevieiraneto.github.io/instrumusic/instrumentos.html').should('include', '#instrumentos')

    cy.contains('Depoimentos').click()
    cy.url("https://henriquevieiraneto.github.io/instrumusic/depoimentos.html).should('include', '#depoimentos'")
  })

  it('Teste 3: Botão "Comece a Aprender"', () => {
    cy.contains('Comece a Aprender').click()
    cy.url('https://henriquevieiraneto.github.io/instrumusic/entry.html').should('include', '#cadastro') // Ajuste conforme destino real
  })

  it('Teste 4: Verificação de rodapé e redes sociais', () => {
    cy.contains('© 2025 InstruMusic').should('be.visible')
    cy.contains('Facebook').should('be.visible')
    cy.contains('Instagram').should('be.visible')
  })
})
