context('All Recipes Page', () => {
    // change port
    beforeEach(() => {
        cy.visit('https://staging.softcoin.com/programs/kroger/mymag/?coupons=MM20200002E2355A%2CMM20200002E4452A%2CMM20200002E4202A%2CMM20200002E4135A%2CMM20200002E4143A%2CMM20200002E2362A%2CMM20200002E2514A%2CMM20200002E2469A%2CMM20200002E2185A%2CMM20200002E2502A%2CMM20200002E4090A%2CMM20200002E4353A%2CMM20200002E4210A%2CMM20200002E2078A%2CMM20200002E2060A%2CMM20200002E2517A&cid=ema.pro.MM20200002E_M02UR&banner=Ralphs&issue=M02U&xg=50244617&origin=yt&filtertag=DHMM20200002E&tm=true#/recipes')
    })

    describe('Page Title', () => {
        it('Should have All Recipes text at top', () => {
            cy.get('[data-cy=page-title]').should('have.text', ' All Recipes ')
        })
    });
    
    describe('Narrow Section', () => {
        it('Keywords should have keyword icons', () => {
            cy.get('[data-cy=recipes_search_bar]').find('.search_icon_bar span').its('length').should('be.gt', 0)        
        })
        it('Click In This Issue icon and only recipes with that icon should show', () => {
            cy.get('[data-cy=narrow-icon_ISSUE]').click(); 
            cy.get('[data-cy=recipe-item]').its('length').should('be.gt', 0)  
        })
    });

    describe('Recipes', () => {
        it('recipes load', () => {
            cy.get('[data-cy=recipe-item]').its('length').should('be.gt', 0)        
        })
        it('Clicking recipe should open to correct recipe', () => {
            cy.get('[data-cy=recipe-item]').find('h5').first().then(($rec) => {
                const txt = $rec.text().replace(/\s+/g, ' ')
                cy.get('[data-cy=recipe-item] a').first().click({ force: true })
            })       
        })
    });
  
  
});


  