import i18n from '@/language'

interface Rule {
    desc: string
    name: string
    type: string
    tp: number
}

const l = (name: string) => i18n.t(`manage_role.args.${name}`) as any

const rule: Rule[] = [
    {
        name: 'DDLCheckTableComment',
        desc: l('DDLCheckTableComment'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDlCheckColumnComment',
        desc: l('DDlCheckColumnComment'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLCheckColumnNullable',
        desc: l('DDLCheckColumnNullable'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLCheckColumnDefault',
        desc: l('DDLCheckColumnDefault'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLCheckFloatDouble',
        desc: l('DDLCheckFloatDouble'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAutoincrementInit',
        desc: l('DDLEnableAutoincrementInit'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLPrimaryKeyMust',
        desc: l('DDLPrimaryKeyMust'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAutoIncrement',
        desc: l('DDLEnableAutoIncrement'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAutoincrementUnsigned',
        desc: l('DDLEnableAutoincrementUnsigned'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLIndexNameSpec',
        desc: l('DDLIndexNameSpec'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'CheckIdentifier',
        desc: l('CheckIdentifier'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableAcrossDBRename',
        desc: l('DDLEnableAcrossDBRename'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableDropTable',
        desc: l('DDLEnableDropTable'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableDropDatabase',
        desc: l('DDLEnableDropDatabase'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLAllowPRINotInt',
        desc: l('DDLAllowPRINotInt'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLEnableNullIndexName',
        desc: l('DDLEnableNullIndexName'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLMultiToSubmit',
        desc: l('DDLMultiToSubmit'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLAllowColumnType',
        desc: l('DDLAllowColumnType'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'DDLAllowChangeColumnPosition',
        desc: l('DDLAllowChangeColumnPosition'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'AllowCreateView',
        desc: l('AllowCreateView'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'AllowCreatePartition',
        desc: l('AllowCreatePartition'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'AllowSpecialType',
        desc: l('AllowSpecialType'),
        type: 'DDL',
        tp: 0
    },
    {
        name: 'SupportCollation',
        desc: l('SupportCollation'),
        type: 'DDL',
        tp: 2
    },
    {
        name: 'SupportCharset',
        desc: l('SupportCharset'),
        type: 'DDL',
        tp: 2
    },
    {
        name: 'MustHaveColumns',
        desc: l('MustHaveColumns'),
        type: 'DDL',
        tp: 2
    },
    {
        name: 'DDLMaxKeyParts',
        desc: l('DDLMaxKeyParts'),
        type: 'DDL',
        tp: 1
    },
    {
        name: 'DDLMaxKey',
        desc: l('DDLMaxKey'),
        type: 'DDL',
        tp: 1
    },
    {
        name: 'MaxDDLAffectRows',
        desc: l('MaxDDLAffectRows'),
        type: 'DDL',
        tp: 1
    },
    {
        name: 'DDLMaxCharLength',
        desc: l('DDLMaxCharLength'),
        type: 'DDL',
        tp: 1
    },
    {
        name: 'MaxTableNameLen',
        desc: l('MaxTableNameLen'),
        type: 'DDL',
        tp: 1
    },
    {
        name: 'DMLMaxInsertRows',
        desc: l('DMLMaxInsertRows'),
        type: 'DML',
        tp: 1
    },
    {
        name: 'DMLAllowLimitSTMT',
        desc: l('DMLAllowLimitSTMT'),
        type: 'DML',
        tp: 0
    },
    {
        name: 'DDLImplicitTypeConversion',
        desc: l('DDLImplicitTypeConversion'),
        type: 'DML',
        tp: 0
    },
    {
        name: 'DMLInsertColumns',
        desc: l('DMLInsertColumns'),
        type: 'DML',
        tp: 0
    },
    {
        name: 'DMLWhere',
        desc: l('DMLWhere'),
        type: 'DML',
        tp: 0
    },
    {
        name: 'DMLOrder',
        desc: l('DMLOrder'),
        type: 'DML',
        tp: 0
    },
    {
        name: 'DMLSelect',
        desc: l('DMLSelect'),
        type: 'DML',
        tp: 0
    },
    {
        name: 'MaxAffectRows',
        desc: l('MaxAffectRows'),
        type: 'DML',
        tp: 1
    },
    {
        name: 'IsOSC',
        desc: l('IsOSC'),
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscBinDir',
        desc: l('OscBinDir'),
        type: 'Pt-osc',
        tp: 2
    },
    {
        name: 'OscSize',
        desc: l('OscSize'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscChunkSize',
        desc: l('OscChunkSize'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscDropNewTable',
        desc: l('OscDropNewTable'),
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscDropOldTable',
        desc: l('OscDropOldTable'),
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscCheckReplicationFilters',
        desc: l('OscCheckReplicationFilters'),
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscCheckAlter',
        desc: l('OscCheckAlter'),
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscCheckUniqueKeyChange',
        desc: l('OscCheckUniqueKeyChange'),
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscPrintSql',
        desc: l('OscPrintSql'),
        type: 'Pt-osc',
        tp: 0
    },
    {
        name: 'OscAlterForeignKeysMethod',
        desc: l('OscAlterForeignKeysMethod'),
        type: 'Pt-osc',
        tp: 2
    },
    {
        name: 'OscLockWaitTimeout',
        desc: l('OscLockWaitTimeout'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscChunkTime',
        desc: l('OscChunkTime'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscSleep',
        desc: l('OscSleep'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscMaxLag',
        desc: l('OscMaxLag'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscCheckInterval',
        desc: l('OscCheckInterval'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscMaxThreadConnected',
        desc: l('OscMaxThreadConnected'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscMaxThreadRunning',
        desc: l('OscMaxThreadRunning'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscCriticalThreadConnected',
        desc: l('OscCriticalThreadConnected'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscCriticalThreadRunning',
        desc: l('OscCriticalThreadRunning'),
        type: 'Pt-osc',
        tp: 1
    },
    {
        name: 'OscRecursionMethod',
        desc: l('OscRecursionMethod'),
        type: 'Pt-osc',
        tp: 2
    },
]


export {
    rule,
    Rule
}
