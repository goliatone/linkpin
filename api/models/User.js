var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  identity: 'User',
  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    // passports : { collection: 'Passport', via: 'user' },
    /////////////////////////
    /// RELATIONSHIPS
    /////////////////////////
    //ONE-TO-MANY
    links: {
        collection: 'link',
        via: 'owner'
    },
    //MANY-TO-ONE
    notes: {
        collection: 'note',
        via: 'author'
    }
  }
};

module.exports = User;
