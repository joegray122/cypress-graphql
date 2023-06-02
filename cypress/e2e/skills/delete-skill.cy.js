/// <reference types="cypress" />

describe('Delete a skill', function () {
  beforeEach(function () {
    /**
     * Ensure we are in a clean state before the test runs.
     * Ideally we would have a cleaner way of setting up test data setup here.
    */
    cy.wrap(`Valid-Skill-${Math.random().toString(20).substr(2, 8)}`).as('validName').then(function () {
      cy.createSkill(`"${this.validName}"`);
      cy.findSkillByName(this.validName).then(function (response) {
        cy.wrap(response.body.data.SkillFindOne.id).as('skillId');
      });
    });
    cy.wrap(`Valid-Skill-${Math.random().toString(20).substr(2, 8)}`).as('validName2')
  })

  it('can delete skill by id', function () {
    cy.deleteSkill(this.skillId).then(function (response) {
      expect(response.status).to.eq(200);
      expect(response.body.data.SkillDeleteOne.affected).to.eq(1);
    });

    cy.findSkillById(this.skillId).then(function (response) {
      // expect(response.status).to.not.eq(200);
      expect(response.body.data.SkillFindOne).to.eq(null);
    });
  });

  it('throws an error if skill id does not exist', function () {
    cy.deleteSkill(123456789987654321).then(function (response) {
      expect(response.status).to.eq(200);
      expect(response.body.data.SkillDeleteOne.affected).to.eq(0);
    });
  })

  it('throws an error if non int passed as Id', function () {
    cy.deleteSkill("abc").then(function (response) {
      expect(response.status).to.eq(200);
      expect(response.body.errors[0].message).to.eq(`Argument "id" has invalid value abc.\nExpected type "Int", found abc.`);
    });
  })
})
