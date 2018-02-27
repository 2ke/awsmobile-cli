jest.mock('fs-extra')
jest.mock('../../lib/project-info-manager.js')
jest.mock('../../lib/utils/awsmobilejs-constant.js')
jest.mock('../../lib/utils/awsmobilejs-path-manager.js')
jest.mock('../../lib/backend-operations/backend-spec-manager.js')
jest.mock('../../lib/backend-operations/ops-project.js')
jest.mock('../../lib/backend-operations/ops-cloud-api.js')

const path = require('path')

const projectInfoManager = require('../../lib/project-info-manager.js')
const awsmobileJSConstant = require('../../lib/utils/awsmobilejs-constant.js')
const pathManager = require('../../lib/utils/awsmobilejs-path-manager.js')
const featureOpsMapping = require('../../lib/utils/feature-ops-mapping.js')
const backendSpecManager = require('../../lib/backend-operations/backend-spec-manager.js')
const opsProject = require('../../lib/backend-operations/ops-project.js')
const opeCloudApi = require('../../lib/backend-operations/ops-cloud-api.js')

const backendBuilder = require('../../lib/build-backend.js')

describe('backend builder', () => {
    const mock_projectInfo = {
        "ProjectName": 'projectName',
        "ProjectPath": '/projectName',
        "SourceDir": "src",
        "DistributionDir": "dist",
        "BuildCommand": "npm run-script build",
        "StartCommand": "npm run-script start",
        'BackendProjectName': 'BackendProjectName', 
        'BackendProjectID': 'BackendProjectID'
    }
    const mock_backendProject = {}
    
    beforeAll(() => {
        global.console = {log: jest.fn()}
        projectInfoManager.getProjectInfo = jest.fn(()=>{
            return mock_projectInfo
        }) 
        projectInfoManager.setProjectInfo = jest.fn()

        backendSpecManager.getBackendProjectObject = jest.fn((projectInfo)=>{
            return mock_backendProject
        })

        pathManager.getOpsFeatureFilePath = jest.fn((featureName)=>{
            return path.normalize(path.join(__dirname +'/../../lib/backend-operations', featureOpsMapping[featureName]))
        })

        backendSpecManager.getEnabledFeaturesFromObject = jest.fn((backendProject) => {
            return ['cloud-api']
        })

        opeCloudApi.build = jest.fn((projectInfo, backendProject, callback)=>{
            callback(true)
        })

        opsProject.build = jest.fn((projectInfo, backendProject, callback)=>{
            callback(true)
        })
    })
    
    test('build', () => {
        const callback = jest.fn()

        backendBuilder.build(callback)
        expect(opeCloudApi.build).toBeCalled()
        expect(opsProject.build).toBeCalled()
        expect(projectInfoManager.setProjectInfo).toBeCalled()
        expect(callback).toBeCalled()
    })
    
})