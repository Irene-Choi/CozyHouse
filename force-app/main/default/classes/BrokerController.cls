public with sharing class BrokerController {
    private static final Integer DEFAULT_PAGE_SIZE = 9;
    
    @AuraEnabled(cacheable=true scope='global')
    public static PagedResult getPagedAgentList(
        String searchKey,
        Integer pageSize,
        Integer pageNumber
    ) {
        Integer safePageSize = (pageSize == null
            ? DEFAULT_PAGE_SIZE
            : pageSize);
        Integer safePageNumber = (pageNumber == null ? 1 : pageNumber);

        String searchPattern = '%' + searchKey + '%';
        Integer offset = (safePageNumber - 1) * safePageSize;

        PagedResult result = new PagedResult();
        result.pageSize = safePageSize;
        result.pageNumber = safePageNumber;

        result.totalItemCount = [
            SELECT COUNT()
            FROM Broker__c
            WHERE
                Name LIKE :searchPattern
        ];

        result.records = [
            SELECT
                Broker_Id__c,
                Name,
                Email__c,
                Mobile_Phone__c,
                Phone__c,
                Picture__c,
                Picture_IMG__c,
                Title__c
            FROM Broker__c
            WHERE
                Name LIKE :searchPattern
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT :safePageSize
            OFFSET :offset
        ];
        return result;
    }
}
