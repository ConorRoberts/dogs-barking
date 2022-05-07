interface ProgramQuery {

    // ID of course (ex. "CIS1500")
    programId?: string;
  
    // School abbreviation ("UOFG" or "UOFT")
    school?: string;
  
    // Course number (ex. 2500)
    name?: string;
    
    // Name of degree (ex. "B.A.Sc.")
    degree?: string;

    // Size of page
    pageSize?: number;
  
    // Index to start collecting results from
    pageNum?: number;
  
    // Sort order for sorting based on sortKey
    sortDir?: "asc" | "desc";
    
    // Field to perform sorting on (ex. "description", "number", etc.)
    sortKey?: string;
  
  }
  
  export default ProgramQuery;
  