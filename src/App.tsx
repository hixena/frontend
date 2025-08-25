import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Input, Form, Radio, InputNumber, message, DatePicker, Select, Tag, Badge, Space, Upload, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useLazyQuery, gql } from '@apollo/client';
import './App.css';


import dayjs from 'dayjs';
import { CaretDownFilled, CaretUpFilled, CloudUploadOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, FileExcelOutlined, FolderAddOutlined, ProductOutlined, SettingOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { exportUsersToExcel, importUsersFromExcel } from './Apollo/client';
const EXPORT_USERS_QUERY = gql`
  query ExportUsersToExcel {
    exportUsersToExcel
  }
`;

const IMPORT_USERS_FROM_EXCEL = gql`
  mutation ImportUsersFromExcel($file: Upload!) {
    importUsersFromExcel(file: $file) {
      errors
      failedCount
      successCount
    }
  }
`;

interface UploadResult {
  errors: string[];
  failedCount: number;
  successCount: number;
}

const FIND_ALL_SKILLS = gql`
  query findAllSkills {
    findAllSkills {
      id
      name
      description
      createdAt
    }
  }
`;

const DELETE_SKILL = gql`
  mutation deleteSkill($id: Int!) {
    deleteSkill(id: $id) {
      id
    }
  }
`;

const GET_SKILL_BY_NAME = gql`
  query getSkillByName($name: String!) {
    getSkillByName(name: $name) {
      id
      name
      description
      createdAt
    }
  }
`;

const ADD_SKILL = gql`
  mutation addSkill($name: String!, $description: String!) {
    addSkill(name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`;

const UPDATE_SKILL = gql`
  mutation updateSkill($id: Int!, $name: String!, $description: String!) {
    updateSkill(id: $id, name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`;

const DELETE_EXPERIENCE = gql`
  mutation deleteExperience($id:Int!){
    deleteExperience(id:$id){
      id
    }
  }
`;

const GET_EXPERIENCEBYNAME = gql`
  query GetExperienceByName($name: String!) {
    getExperienceByName(name: $name) {
      id
      name
      address
      startTime
      endTime
      createdAt
    }
  }
`;

const GET_ALL_EXPERIENCES = gql`
  query getAllExperiences {
    getAllExperiences {
      id
      name
      address
      startTime
      endTime
      createdAt
      user {
        name
      }
    }
  }
`;

const ADD_EXPERIENCE = gql`
  mutation AddExperience(
    $name: String!
    $address: String
    $userId: Int!
    $startTime: DateTime!
    $endTime: DateTime!
  ) {
    addExperience(
      name: $name
      address: $address
      userId: $userId
      startTime: $startTime
      endTime: $endTime
    ) {
      id
      name
      address
      startTime
      endTime
      user {
        name
      }
    }
  }
`;

const UPDATE_EXPERIENCE = gql`
  mutation editExperience(
    $id: Int!
    $name: String!
    $address: String
    $userId: Int!
    $startTime: DateTime!  
    $endTime: DateTime!
  ) {
    editExperience(
      id: $id
      name: $name
      address: $address
      userId: $userId
      startTime: $startTime  
      endTime: $endTime
    ) {
      id
      name
      address
      startTime
      endTime
      user {
        name
      }
    }
  }
`;

const UPDATE_UNIT = gql`
  mutation UpdateUnit($id: Int!, $name: String, $code: String) {
    updateUnit(id: $id, name: $name, code: $code) {
      id
      name
      code
      createdAt
    }
  }
`;

const DELETE_Unit = gql`
  mutation DeleteUnit($id: Int!) {
    deleteUnit(id: $id) {
      code
    }
  }
`;

const GET_UNITBYNAME = gql`
  query GetUnitByName($name: String!) {
    getUnitByName(name: $name) {
      id
      name
      code
      createdAt
    }
  }
`;

const GET_UNIT = gql`
  query GetUnit {
    getUnit {
      id
      name
      code
      createdAt
    }
  }
`;

const ADD_UNIT = gql`
  mutation AddUnit($name: String!, $code: String!) {
    addUnit(name: $name, code: $code) {
      id
      name
      code
      createdAt
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      code
      message
    }
  }
`;


const GET_ALL_PROFILES = gql`
  query GetAllProfiles {
    getAllProfiles {
      id
      username
      name
      telephone
      email
      age
      gender
      marital
      address
      isEnable
      unit_id
      unit {
        id
        name
        code
      }
      skills {  
        id
        name
        description
        createdAt
      }
      }
    }
`;

const GET_PROFILE_BY_USERNAME = gql`
  query GetProfileByUsername($username: String!) {
    getProfileByUsername(username: $username) {
      id
      username
      name
      telephone
      email
      age
      gender
      marital
      address
      isEnable
      unit_id
      unit {
        id
        name
        code
      }
      skills {  
        id
        name
        description
        createdAt
      }
    }
  }
`;

const ADD_USER_MUTATION = gql`
  mutation Add(
    $username: String!
    $password: String!
    $name: String
    $isEnable: Boolean
    $age: Int
    $gender: Int
    $telephone: String
    $email: String
    $marital: Int
    $address: String
    $unit_id: Int!
    $skillIds: [Int!]
  ) {
    Add(
      username: $username
      password: $password
      name: $name
      isEnable: $isEnable
      age: $age
      gender: $gender
      telephone: $telephone
      email: $email
      marital: $marital
      address: $address
      unit_id: $unit_id
      skillIds: $skillIds
    ) {
      id
      username
      name
      telephone
      email
      age
      gender
      marital
      address
      isEnable
      unit_id
      unit {
        id
        name
        code
      }
      skills {
        id
        name
        description
        createdAt
      }
    }
  }
`;
const EDIT_USER_MUTATION = gql`
  mutation EditUser(
    $id: Int!
    $username: String!
    $name: String
    $isEnable: Boolean
    $age: Int
    $gender: Int
    $telephone: String
    $email: String
    $marital: Int
    $address: String
    $unit_id: Int
    $skillIds: [Int!]
  ) {
    Edit(
      id: $id
      username: $username
      name: $name
      isEnable: $isEnable
      age: $age
      gender: $gender
      telephone: $telephone
      email: $email
      marital: $marital
      address: $address
      unit_id: $unit_id
      skillIds: $skillIds
    ) {
      id       
      username
      name
      isEnable
      skills {
        id    
        name
      }
    
    }
  }
`;
interface ExportResult {
  filename: string;
  data: string; // base64数据
}

interface UserProfile {
  id: number;
  username: string;
  name?: string;
  telephone?: string;
  email?: string;
  age?: number;
  gender?: number;
  marital?: number;
  address?: string;
  isEnable: boolean;
  unit_id: number;
  unit?: {
    id: number;
    name: string;
    code?: string;
  };
 skills: Skill[]; 
}


interface UnitProfile {
  id: number;
  name: string;
  code?: string;
  createdAt: Date;
}

interface ExperienceProfile {
  id: number;
  name: string;
  address?: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  user?: UserProfile;
}

interface Skill {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
}

const App: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<{id: number, name: string}[]>([]);
const [selectedUserName, setSelectedUserName] = useState('');
  const [omitSkills, setOmitSkills] = useState(false);
  const [fileInformation,setFileInformation] = useState('upload')
  const [fileUpload,setfileUpload] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserTable, setShowUserTable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchUsername, setSearchUsername] = useState<string | null>(null);
  const [searchUnitName, setSearchUnitName] = useState('');
  const [searchExperienceName, setSearchExperienceName] = useState('');
  const [searchSkillName, setSearchSkillName] = useState('');
  const [editingRecord, setEditingRecord] = useState<UserProfile | null>(null);
  const [editingUnit, setEditingUnit] = useState<UnitProfile | null>(null);
  const [editingExperience, setEditingExperience] = useState<ExperienceProfile | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUnitEditModalOpen, setIsUnitEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isAddExperienceModalOpen, setIsAddExperienceModalOpen] = useState(false);
  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isEditSkillModalOpen, setIsEditSkillModalOpen] =useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [deleteId, setDeleteId] = useState(0);
const [deleteType, setDeleteType] = useState('user'); // 'user', 'unit', 'experience', 'skill'
const [activeModule, setActiveModule] = useState('');
  const [activeTable, setActiveTable] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });


  const [newUnitName, setNewUnitName] = useState('');
  const [isUnitAdding, setIsUnitAdding] = useState(false);


  const [deleteExperience] = useMutation(DELETE_EXPERIENCE);
  const [updateExperience] = useMutation(UPDATE_EXPERIENCE);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [deleteUnit] = useMutation(DELETE_Unit)

  const [addUser] = useMutation(ADD_USER_MUTATION);
  const [editUser] = useMutation(EDIT_USER_MUTATION);
  const [updateUnit] = useMutation(UPDATE_UNIT);
  const [addUnit] = useMutation(ADD_UNIT);
  const [addExperience] = useMutation(ADD_EXPERIENCE);
 const [deleteSkill] = useMutation(DELETE_SKILL, {
  refetchQueries: [
    { query: GET_ALL_PROFILES } 
  ]
});
  const [addSkill] = useMutation(ADD_SKILL);
  const [updateSkill] = useMutation(UPDATE_SKILL);
  
  const [getUnitByName, { loading: unitSearchLoading, data: unitSearchData }] = useLazyQuery(GET_UNITBYNAME);
  const [getExperienceByName, { loading: experienceSearchLoading, data: experienceSearchData }] = useLazyQuery(GET_EXPERIENCEBYNAME);
  const [getSkillByName, { loading: skillSearchLoading, data: skillSearchData }] = useLazyQuery(GET_SKILL_BY_NAME);
  
  const { 
    loading: queryLoading, 
    data: queryData, 
    refetch: refetchAll 
  } = useQuery(GET_ALL_PROFILES, {
    onCompleted: (data) => {
      if (data?.getAllProfiles) {
        setPagination(prev => ({
          ...prev,
          total: data.getAllProfiles.length,
        }));
      }
    }
  });

  const { 
    loading: searchLoading, 
    data: searchData,
    refetch: refetchSearch 
  } = useQuery(GET_PROFILE_BY_USERNAME, {
    variables: { username: searchUsername || '' },
    skip: !searchUsername,
  });

  const { 
    loading: unitLoading, 
    data: unitData,
    refetch: refetchUnits 
  } = useQuery(GET_UNIT);

  const { 
    loading: experienceLoading, 
    data: experienceData,
    refetch: refetchExperience 
  } = useQuery(GET_ALL_EXPERIENCES);

  const { 
    loading: skillLoading, 
    data: skillData,
    refetch: refetchSkills 
  } = useQuery(FIND_ALL_SKILLS);
  const [importUsers] = useMutation(IMPORT_USERS_FROM_EXCEL);
  const { loading, error, data, refetch } = useQuery(EXPORT_USERS_QUERY, {
    fetchPolicy: 'no-cache',
    skip: true, // 初始不执行，只在点击按钮时执行
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);


const handleOpenSkillModal = (skills: {id: number, name: string}[], userName: string) => {
  setSelectedSkills(skills);
  setSelectedUserName(userName);
  setOmitSkills(true);
};



const handleOmitSkills = () => {
  setOmitSkills(false);
}

 const handleExport = async () => {
    console.log('点击导出按钮');
    await exportUsersToExcel();
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  useEffect(() => {
    if (data?.exportUsersToExcel) {
      const downloadUrl = data.exportUsersToExcel;
      // 确保URL是完整的
      const fullUrl = downloadUrl.startsWith('http') ? downloadUrl : window.location.origin + downloadUrl;
      // 从URL中提取文件名
      const filename = downloadUrl.split('/').pop() || '用户数据.xlsx';
      
      // 创建临时a标签触发下载
      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [data]);

  // 处理错误情况
  useEffect(() => {
    if (error) {
      console.error('导出用户数据失败:', error);
      alert('导出用户数据失败，请重试');
    }
  }, [error]);

  // 修改 useEffect 监听搜索数据变化
  useEffect(() => {
    // 当搜索数据或查询数据变化时，更新分页总数
    const total = searchUsername && searchData?.getProfileByUsername ? 1 : queryData?.getAllProfiles?.length || 0;
    setPagination(prev => ({
      ...prev,
      total
    }));
  }, [searchData, queryData, searchUsername]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setSelectedFile(e.target.files[0]);
    setFileInformation('achieve'); // 选择文件后自动切换到文件信息区域
  }
};

const handleSubmit = (event?: React.FormEvent) => {
  // 如果有 event 参数，阻止默认行为
  if (event) {
    event.preventDefault();
  }
  
  if (!selectedFile) return;

  setUploading(true);
  setUploadResult(null);

  // 提交文件
  importUsers({
    variables: {
      file: selectedFile,
    },
    onCompleted: (data) => {
      setUploading(false);
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = '';
      }
      refetchAll();
      message.success('上传成功');
      setFileInformation('upload'); // 切换回默认上传界面
      setfileUpload(false); // 关闭Modal
    },
    onError: (error) => {
      setUploading(false);
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = '';
      }
      message.error('上传失败: ' + (error.message || '未知错误'));
      setFileInformation('upload'); // 切换回默认上传界面
    }
  });
};






const getColorById = (id: number): string => {
  const COLORS = ['blue', 'green', 'orange', 'pink', 'purple'] as const;
  return COLORS[Math.abs(id % 5)]; // 绝对保证五种颜色循环
};
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [unitForm] = Form.useForm();
  const [addUnitForm] = Form.useForm();
  const [experienceForm] = Form.useForm();
  const [skillForm] = Form.useForm();
  const [addSkillForm] = Form.useForm();
const [deleteForm] = Form.useForm();


  const columns: ColumnsType<UserProfile> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (text) => (
        <a 
          href={`/user/${text}`}  
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {text}
        </a>
      ),
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '手机',
      dataIndex: 'telephone',
      align: 'center',
    },
    {
      title: '单位',
      render: (_, record) => record.unit?.name || "未分配单位",
      align: 'center',
    },
{
  title: '技能',
  dataIndex: 'skills',
  render: (skills, record) => {
    if (!skills || skills.length === 0) {
      return <span style={{ color: '#999' }}>-</span>;
    }
    else if (skills.length > 3) {
      return (
        <Space size={4} wrap>
          {skills.slice(0, 3).map(skill => (
            <Tag key={skill.id} color={getColorById(skill.id)}>
              {skill.name}
            </Tag>
          ))}
          <Tag 
            color={'blue'} 
            style={{ background: '#f0f0f0', color: '#666', cursor: 'pointer' }}
            onClick={() => handleOpenSkillModal(skills, record.name)}
          >
            +{skills.length - 3}...
          </Tag>
        </Space>
      );
    }
    
    return (
      <Space size={4} wrap>
        {skills.map(skill => (
          <Tag key={skill.id} color={getColorById(skill.id)}>
            {skill.name}
          </Tag>
        ))}
      </Space>
    );
  },
  align: 'center',
},
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val) => val === 1 ? '男' : '女',
      align: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
    },

  {
    title: '状态',
    dataIndex: 'isEnable',
    render: (enabled: boolean) => (
      <Badge 
        status={enabled ? 'success' : 'error'} 
        text={enabled ? '启用' : '禁用'}
      />
    ),
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button 
          type="link" 
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
        <Button 
          danger
          type="text" 
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>
      </Space>
    ),
    align: 'center',
  }
  ];

  const unitColumns: ColumnsType<UnitProfile> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: '单位名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '单位编码',
      dataIndex: 'code',
      align: 'center',
    },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    align: 'center', // 关键修改
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button 
          type="link" 
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditUnit(record)}
        >
          编辑
        </Button>
        <Button 
          danger
          type="text" 
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteUnit(record.id)}
        >
          删除
        </Button>
      </Space>
    ),
    align: 'center',
  }
  ];
  

  const experienceColumns: ColumnsType<ExperienceProfile> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: '经历名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '所属用户',
      dataIndex: ['user', 'name'],
      key: 'userName',
      render: (_, record) => record.user?.name || '未知用户',
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
    },

  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button 
          type="link" 
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditExperience(record)}
        >
          编辑
        </Button>
        <Button 
          danger
          type="text" 
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteExperience(record.id)}
        >
          删除
        </Button>
      </Space>
    ),align: 'center',
  }
  ];

  const skillColumns: ColumnsType<Skill> = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: '技能名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '技能描述',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
    },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button 
          type="link" 
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditSkill(record)}
        >
          编辑
        </Button>
        <Button 
          danger
          type="text" 
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteSkill(record.id)}
        >
          删除
        </Button>
      </Space>
    ),align: 'center',
  }
  ];

const switchTable = (tableName: string) => {
  setActiveTable(tableName);

  setPagination(prev => ({
    ...prev,
    current: 1
  }));
};


  const handleSearch = () => {
    if (!searchInput.trim()) {
      message.error('请输入用户名');
      return;
    }
    setSearchUsername(searchInput);
    // 搜索时重置分页到第一页
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    refetchSearch();
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchUsername(null);
    // 清除搜索时重置分页到第一页
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleUnitSearch = () => {
    if (searchUnitName.trim()) {
      getUnitByName({ variables: { name: searchUnitName } });
    } else {
      refetchUnits();
    }
  };

  const handleExperienceSearch = () => {
    if (searchExperienceName.trim()) {
      getExperienceByName({ variables: { name: searchExperienceName } });
    } else {
      refetchExperience();
    }
  };

  const handleSkillSearch = () => {
    if (searchSkillName.trim()) {
      getSkillByName({ variables: { name: searchSkillName } });
    } else {
      refetchSkills();
    }
  };

const handleDelete = (id: number) => {
  setDeleteId(id);
  setDeleteType('user');
  setIsDeleteModalOpen(true);
};
const handleDeleteUnit = (id: number) => {
  setDeleteId(id);
  setDeleteType('unit');
  setIsDeleteModalOpen(true);
};

  const handleDeleteExperience = (id: number) => {
  setDeleteId(id);
  setDeleteType('experience');
  setIsDeleteModalOpen(true);
};

const handleDeleteSkill = (id: number) => {
  setDeleteId(id);
  setDeleteType('skill');
  setIsDeleteModalOpen(true);
};

const handleDeleteConfirm = async () => {
  try {
    if (deleteType === 'user') {
      await deleteUser({ variables: { id: deleteId } });
      message.success('用户删除成功');
      refetchAll();
    } else if (deleteType === 'unit') {
      await deleteUnit({
        variables: { id: deleteId },
        update: (cache) => {
          cache.evict({
            id: cache.identify({
              __typename: 'Unit',
              id: deleteId
            })
          });
          cache.gc();
        }
      });
      message.success('单位删除成功');
      refetchUnits();
    } else if (deleteType === 'experience') {
      await deleteExperience({ variables: { id: deleteId } });
      message.success('经历删除成功');
      refetchExperience();
    } else if (deleteType === 'skill') {
      await deleteSkill({
        variables: { id: deleteId },
        refetchQueries: [
          { query: GET_ALL_PROFILES }, 
          { query: FIND_ALL_SKILLS }
        ]
      });
      message.success('技能删除成功');
    }
    setIsDeleteModalOpen(false);
  } catch (error) {
    message.error(`删除${
      deleteType === 'user' ? '用户' :
      deleteType === 'unit' ? '单位' :
      deleteType === 'experience' ? '经历' : '技能'
    }失败`);
  }
};

  const handleEdit = (record: UserProfile) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      unit_id: record.unit?.id,
      skillIds: record.skills?.map(skill => skill.id) || [],
      isEnable: record.isEnable // 显式设置isEnable字段
    });
    setIsEditModalOpen(true);
  };

  const handleEditUnit = (record: UnitProfile) => {
    setEditingUnit(record);
    unitForm.setFieldsValue({
      name: record.name,
      code: record.code || ''
    });
    setIsUnitEditModalOpen(true);
  };

  const handleEditExperience = (record: ExperienceProfile) => {
    setEditingExperience(record);
    experienceForm.setFieldsValue({
      name: record.name,
      address: record.address,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime),
      userId: record.user?.id
    });
    setIsEditExperienceModalOpen(true);
  };

  const handleEditSkill = (record: Skill) => {
    setEditingSkill(record);
    skillForm.setFieldsValue({
      name: record.name,
      description: record.description
    });
    setIsEditSkillModalOpen(true);
  };

  const handleAddNewUnit = async () => {
    if (!newUnitName.trim()) {
      message.error('请输入单位名称');
      return;
    }

    setIsUnitAdding(true);
    try {
      const { data } = await getUnitByName({ 
        variables: { name: newUnitName } 
      });
      
      if (data?.getUnitByName) {
        message.error('单位名称已存在');
        return;
      }

      const { data: newUnit } = await addUnit({
        variables: { 
          name: newUnitName,
          code: '' 
        }
      });

      message.success('单位添加成功');
      setNewUnitName('');
      refetchUnits(); 
      

      if (isEditModalOpen) {
        form.setFieldsValue({ unit_id: newUnit?.addUnit.id });
      } else if (isAddModalOpen) {
        addForm.setFieldsValue({ unit_id: newUnit?.addUnit.id });
      }
    } catch (error) {
      message.error(`添加单位失败: ${(error as Error).message}`);
    } finally {
      setIsUnitAdding(false);
    }
  };
const handleEditSubmit = async (values: any) => {
  try {
    console.log('提交的isEnable值:', values.isEnable); // 添加这行日志
    console.log('表单当前isEnable值:', form.getFieldValue('isEnable'));
    const { data } = await editUser({
      variables: {
          id: editingRecord?.id, 
          username: values.username,
          name: values.name,
          isEnable: values.isEnable,
          age: values.age,
          gender: values.gender,
          telephone: values.telephone,
          email: values.email,
          marital: values.marital,
          address: values.address,
          unit_id: values.unit_id,
          skillIds: values.skillIds || [],
        },

      update: (cache, { data: { Edit } }) => {
        if (!Edit?.id) return; 
        
        cache.modify({
          id: cache.identify({
            __typename: 'UserProfile',
            id: Edit.id, 
          }),
          fields: {
            username: () => Edit.username,
            name: () => Edit.name,
            isEnable: () => Edit.isEnable,
            skills: () => Edit.skills || [], 
          },
        });
      },
    });

    if (!data?.Edit?.id) {
      throw new Error('服务器未返回有效ID');
    }

    message.success('用户信息已更新');
    setIsEditModalOpen(false);
    await refetchAll(); 
  } catch (error) {
    console.error('更新错误详情:', error);
    message.error(
      (error as Error).message.includes('non-nullable') 
        ? '数据异常：请联系管理员' 
        : '更新失败'
    );
  }
};

  const handleUnitEditSubmit = async (values: { name: string; code?: string }) => {
    if (!editingUnit) {
      message.error('没有选中要编辑的单位');
      return;
    }

    try {
      await updateUnit({
        variables: {
          id: editingUnit.id,
          name: values.name,
          code: values.code || null
        }
      });
      message.success('单位更新成功');
      setIsUnitEditModalOpen(false);
      refetchUnits();
    } catch (error) {
      message.error('单位更新失败');
      console.error('更新单位错误:', error);
    }
  };

  const handleAddSubmit = async (values: any) => {
    try {
      await addUser({ 
        variables: {
          ...values,
          skillIds: values.skillIds || [] 
        } 
      });
      message.success('添加成功');
      setIsAddModalOpen(false);
      refetchAll();
    } catch (error) {
      message.error('添加失败');
    }
  };

  const handleAddUnitSubmit = async (values: { name: string; code: string }) => {
    try {
      await addUnit({
        variables: {
          name: values.name,
          code: values.code
        }
      });
      message.success('单位添加成功');
      setIsAddUnitModalOpen(false);
      refetchUnits();
    } catch (error) {
      message.error(`添加失败: ${(error as Error).message}`);
    }
  };

  const handleAddExperienceSubmit = async (values: any) => {
    try {
      await addExperience({
        variables: {
          name: values.name,
          address: values.address || null,
          userId: values.userId,
          startTime: dayjs(values.startTime).toISOString(),
          endTime: dayjs(values.endTime).toISOString()
        }
      });
      message.success('经历添加成功');
      setIsAddExperienceModalOpen(false);
      refetchExperience();
    } catch (error) {
      message.error(`添加经历失败: ${(error as Error).message}`);
    }
  };

  const handleEditExperienceSubmit = async (values: any) => {
    if (!editingExperience) return;
    
    try {
      await updateExperience({
        variables: {
          id: editingExperience.id,
          name: values.name,
          address: values.address || null,
          userId: values.userId,
          startTime: dayjs(values.startTime).toISOString(),
          endTime: dayjs(values.endTime).toISOString()
        }
      });
      message.success('经历更新成功');
      setIsEditExperienceModalOpen(false);
      refetchExperience();
    } catch (error) {
      message.error(`更新经历失败: ${(error as Error).message}`);
    }
  };

  const handleAddSkillSubmit = async (values: { name: string; description: string }) => {
    try {
      await addSkill({
        variables: {
          name: values.name,
          description: values.description
        }
      });
      message.success('技能添加成功');
      setIsAddSkillModalOpen(false);
      refetchSkills();
    } catch (error) {
      message.error(`添加技能失败: ${(error as Error).message}`);
    }
  };

  const handleEditSkillSubmit = async (values: { name: string; description: string }) => {
    if (!editingSkill) return;
    
    try {
      await updateSkill({
        variables: {
          id: editingSkill.id,
          name: values.name,
          description: values.description
        }
      });
      message.success('技能更新成功');
      setIsEditSkillModalOpen(false);
      refetchSkills();
    } catch (error) {
      message.error(`更新技能失败: ${(error as Error).message}`);
    }
  };


  const tableData = searchUsername && searchData?.getProfileByUsername 
    ? [searchData.getProfileByUsername]
    : queryData?.getAllProfiles || [];

  const unitTableData = searchUnitName ? 
    (unitSearchData?.getUnitByName ? [unitSearchData.getUnitByName] : []) : 
    unitData?.getUnit || [];

  const experienceTableData = searchExperienceName ? 
    (experienceSearchData?.getExperienceByName ? [experienceSearchData.getExperienceByName] : []) : 
    experienceData?.getAllExperiences || [];

  const skillTableData = searchSkillName ? 
    (skillSearchData?.getSkillByName ? [skillSearchData.getSkillByName] : []) : 
    skillData?.findAllSkills || [];

  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));
  };

  return (
    <div className="App">
      <div className="header">
        <div className="left header1 HEADER"></div>
        <div className="right header1">
          <span className="header2">用户后台管理系统</span>
          <div className='hello'>
             <img src="/login.png" style={{width:'40px',height:'40px'}} alt="" />

              &nbsp;<span style={{fontSize:'20px'}}>你好，召唤师</span>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="left content1 CONTENT">
          <div className="basic1">
            <div className="left_item1">
              <span className='tubiao'><ProductOutlined /></span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="title_text">量表管理</span>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="fuhao"><CaretDownFilled /> </span>
            </div>
          </div>

          <div className="basic2">
            <div className="left_item2">
              <span className='tubiao'><SettingOutlined /></span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="title_text">基础设置</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span 
                className="fuhao" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
              >
                {showUserMenu ? <CaretDownFilled /> : <CaretUpFilled />}
              </span>
            </div>
          
            {showUserMenu && (
              <div className="sub_menu">
  <div
    style={{backgroundColor: activeModule =='user'? '#F8F8F8':'white',color: activeModule == 'user'? '#1565C0':'black'}}
    className="sub_item1"
    onClick={() => {
      setShowUserTable(true);
      switchTable('user');
      setActiveModule('user');
    }}
  >
    用户管理
  </div>
  <div
    style={{backgroundColor: activeModule =='compony'? '#F8F8F8':'white',color: activeModule == 'compony'? '#1565C0':'black'}}
    className="sub_item2"
    onClick={() => {
      setShowUserTable(true);
      switchTable('compony');
      setActiveModule('compony');
    }}
  >
    单位管理
  </div>
  <div
    style={{backgroundColor: activeModule =='experience'? '#F8F8F8':'white',color: activeModule == 'experience'? '#1565C0':'black'}}
    className="sub_item3"
    onClick={() => {
      setShowUserTable(true);
      switchTable('experience');
      setActiveModule('experience');
    }}
  >
    经历管理
  </div>
  <div
    style={{backgroundColor: activeModule =='skill'? '#F8F8F8':'white',color: activeModule == 'skill'? '#1565C0':'black'}}
    className="sub_item4"
    onClick={() => {
      setShowUserTable(true);
      switchTable('skill');
      setActiveModule('skill');
    }}
  >
    技能管理
  </div>
</div>
            )}
          </div>
        </div>

        <div className="right content1" style={{display: activeTable === 'user' ? 'block' : 'none'}}>
          {showUserTable && (
            <div className="right_content">
              <div className="right_content_header" style={{margin:'0  30px'}}>
                
                <div className='gap1' style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="输入用户名"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onPressEnter={handleSearch}
                  />
                  <Button onClick={handleSearch}>搜索</Button>
                  {searchUsername && <Button onClick={handleClearSearch}>清除</Button>}
                </div>
                
                <div style={{display: 'flex', gap: '8px'}}>
                  <Button className='gap2' type="primary" onClick={() => setIsAddModalOpen(true)}>
                    添加新用户
                  </Button>
                  
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                    id="file-upload-input"
                  />
                  
                  <Button 
                    className='gap2'
                    type="primary"
                    onClick={() => setfileUpload(true)}
                    disabled={uploading}

                  >
                    上传文件
                  </Button>
                  
                  <Button className='gap2' type="primary" onClick={handleExport} style={{backgroundColor: '#1890ff'}}>
                    导出用户数据
                  </Button>
                </div>
                
                {uploadResult && (
                  <div className={`result ${uploadResult.successCount > 0 && uploadResult.failedCount === 0 ? 'success' : 'error'}`}>
                    {uploadResult.successCount > 0 && uploadResult.failedCount === 0 ? (
                      <> 
                        <p>上传成功!</p>
                        <p>成功导入: {uploadResult.successCount} 条记录</p>
                      </>
                    ) : (
                      <> 
                        <p>上传失败</p>
                        <p>成功导入: {uploadResult.successCount} 条记录</p>
                        <p>失败: {uploadResult.failedCount} 条记录</p>
                        {uploadResult.errors.length > 0 && (
                          <div className="error-details">
                            <p>错误信息:</p>
                            <ul>
                              {uploadResult.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              

              <Table
              style={{margin:'20px 30px 30px 30px',boxSizing:'border-box', minHeight: '500px'}}
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                loading={queryLoading || searchLoading}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: tableData.length, // 直接使用当前数据长度作为总数
                  showSizeChanger: false,
                  showTotal: (total) => `共 ${total} 条`,
                  style:{position:'absolute',
                        top:'620px',
                        right:'20px'
                    
                  }
                }}
                onChange={handleTableChange}
              />
            </div>
              
           
          )}






        </div>


        <div className="right content1" style={{display: activeTable === 'compony' ? 'block' : 'none'}}>
          {showUserTable && (
          
            <div className="right_content">
                  <div className="right_content_header" style={{margin:'0  30px'}}>

                <div className='gap1' style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="输入单位名称"
                    value={searchUnitName}
                    onChange={(e) => setSearchUnitName(e.target.value)}
                    onPressEnter={handleUnitSearch}
                  />
                  <Button onClick={handleUnitSearch}>搜索</Button>
                  {searchUnitName && <Button onClick={() => {
                    setSearchUnitName('');
                    refetchUnits();
                  }}>清除</Button>}
                </div>
                <Button className='gap2' type="primary" onClick={() => setIsAddUnitModalOpen(true)}>
                  添加新单位
                </Button>
              </div>
              
<Table
  style={{margin:'20px 30px 30px 30px',boxSizing:'border-box', minHeight: '500px'}}
  columns={unitColumns}
  dataSource={unitTableData}
  rowKey="id"
  loading={unitLoading || unitSearchLoading}
  pagination={{
    current: pagination.current,
    pageSize: 10, // 固定每页显示10条
    total: unitTableData.length,
    showSizeChanger: false,
    showQuickJumper: false,
    showTotal: (total) => `共 ${total} 条`,
                  style:{position:'absolute',
                        top:'620px',
                        right:'20px'
                    
                  }
  }}
  onChange={handleTableChange}
/>

            </div>
              
           
          )}
        </div>

        <div className="right content1" style={{display: activeTable === 'experience' ? 'block' : 'none'}}>
          {showUserTable && (
           
            <div className="right_content">
                          <div className="right_content_header" style={{margin:'0  30px'}}>

                <div className='gap1' style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="输入经历名称"
                    value={searchExperienceName}
                    onChange={(e) => setSearchExperienceName(e.target.value)}
                    onPressEnter={handleExperienceSearch}
                  />
                  <Button onClick={handleExperienceSearch}>搜索</Button>
                  {searchExperienceName && <Button onClick={() => {
                    setSearchExperienceName('');
                    refetchExperience();
                  }}>清除</Button>}
                </div>


                <Button className='gap2' type="primary" onClick={() => setIsAddExperienceModalOpen(true)}>
                  添加新经历
                </Button>
              </div>
              
              <Table
              
                style={{margin:'20px 30px 30px 30px',boxSizing:'border-box'}}
                columns={experienceColumns}
                dataSource={experienceTableData}
                rowKey="id"
                loading={experienceLoading || experienceSearchLoading}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: experienceTableData.length,
                  showSizeChanger: false,
                  showTotal: (total) => `共 ${total} 条`,

                  style:{position:'absolute',
                        top:'620px',
                        right:'20px'
                    
                  }
                }}
                onChange={handleTableChange}
              />
           

            </div>
    
          )}
        </div>

        <div className="right content1" style={{display: activeTable === 'skill' ? 'block' : 'none'}}>
          {showUserTable && (
              <div className="right_content">
                              <div className="right_content_header" style={{margin:'0  30px'}}>
                
                <div className='gap1' style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="输入技能名称"
                    value={searchSkillName}
                    onChange={(e) => setSearchSkillName(e.target.value)}
                    onPressEnter={handleSkillSearch}
                  />
                  <Button onClick={handleSkillSearch}>搜索</Button>
                  {searchSkillName && <Button onClick={() => {
                    setSearchSkillName('');
                    refetchSkills();
                  }}>清除</Button>}
                </div>
                <Button className='gap2' type="primary" onClick={() => setIsAddSkillModalOpen(true)}>
                  添加新技能
                </Button>
              </div>
              
              <Table
              style={{margin:'20px 30px 30px 30px',boxSizing:'border-box'}}
                columns={skillColumns}
                dataSource={skillTableData}
                rowKey="id"
                loading={skillLoading || skillSearchLoading}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: skillTableData.length,
                  showSizeChanger: false,
                  showTotal: (total) => `共 ${total} 条`,
                  style:{position:'absolute',
                        top:'620px',
                        right:'20px'
                    
                  }
                }}
                onChange={handleTableChange}
              />
        

            </div>
    
          )}
        </div>
      </div>

      <Modal
        title="编辑用户"
        open={isEditModalOpen}
        getContainer={false}
        style={{ 
          top: 20,
          right: 17 
        }}
        onOk={() => form.submit()}
        onCancel={() => setIsEditModalOpen(false)}
        width={800}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="姓名" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="电话" name="telephone">
            <Input />
          </Form.Item>
          
          <Form.Item label="所属单位" name="unit_id">
            <Select
              placeholder="选择单位"
              loading={unitLoading}
              options={unitData?.getUnit?.map((unit: UnitProfile) => ({
                label: `${unit.name}${unit.code ? ` (${unit.code})` : ''}`,
                value: unit.id
              }))}
            />
          </Form.Item>
          
          <Form.Item label="技能" name="skillIds">
            <Select
              mode="multiple"
              placeholder="选择技能"
              loading={skillLoading}
              options={skillData?.findAllSkills?.map((skill: Skill) => ({
                label: skill.name,
                value: skill.id
              }))}
            />
          </Form.Item>

          <Form.Item label="年龄" name="age">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="地址" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="isEnable" valuePropName="checked">
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑单位"
        open={isUnitEditModalOpen}
        getContainer={false}
        style={{ 
          top: 20,
          right: 17 
        }}
        onOk={() => unitForm.submit()}
        onCancel={() => setIsUnitEditModalOpen(false)}
        width={600}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form form={unitForm} onFinish={handleUnitEditSubmit}
        layout="vertical">
          <Form.Item label="单位名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="单位编码" name="code">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

     <Modal
  title="添加用户"
  open={isAddModalOpen}
  getContainer={false}
  style={{ 
    top: 20,
    right: 17 
  }}
  onOk={() => addForm.submit()}
  onCancel={() => setIsAddModalOpen(false)}
  width={800}
  destroyOnClose
  okText="确定"
  cancelText="取消"
>
  <Form form={addForm} onFinish={handleAddSubmit} layout="vertical">

    <Form.Item 
      label="用户名" 
      name="username" 
      rules={[{ required: true, message: '请输入用户名' }]}
    >
      <Input placeholder="输入用户名" />
    </Form.Item>


    <Form.Item 
      label="密码" 
      name="password" 
      rules={[{ required: true, message: '请输入密码' }]}
    >
      <Input.Password placeholder="输入密码" />
    </Form.Item>


    <Form.Item label="姓名" name="name">
      <Input placeholder="输入姓名" />
    </Form.Item>


    <Form.Item label="电话" name="telephone">
      <Input placeholder="输入电话" />
    </Form.Item>

    <Form.Item 
      label="所属单位" 
      name="unit_id"
      rules={[{ required: true, message: '请选择所属单位' }]}
    >
      <Select
        placeholder="选择单位"
        loading={unitLoading}
        options={unitData?.getUnit?.map((unit: UnitProfile) => ({
          label: `${unit.name}${unit.code ? ` (${unit.code})` : ''}`,
          value: unit.id
        }))}
      />
    </Form.Item>

    <Form.Item label="技能" name="skillIds">
      <Select
        mode="multiple"
        placeholder="选择技能"
        loading={skillLoading}
        options={skillData?.findAllSkills?.map((skill: Skill) => ({
          label: skill.name,
          value: skill.id
        }))}
      />
    </Form.Item>



    <Form.Item label="年龄" name="age">
      <InputNumber style={{ width: '100%' }} placeholder="输入年龄" />
    </Form.Item>


    <Form.Item 
      label="性别" 
      name="gender"
      rules={[{ required: true, message: '请选择性别' }]}
    >
      <Radio.Group>
        <Radio value={1}>男</Radio>
        <Radio value={2}>女</Radio>
      </Radio.Group>
    </Form.Item>

    <Form.Item label="地址" name="address">
      <Input placeholder="输入地址" />
    </Form.Item>


    <Form.Item label="状态" name="isEnable" valuePropName="checked">
      <Switch
        checkedChildren="启用"
        unCheckedChildren="禁用"
        defaultChecked
      />
    </Form.Item>
  </Form>
</Modal>
      <Modal
        title="添加单位"
        open={isAddUnitModalOpen}
        onOk={() => addUnitForm.submit()}
        getContainer={false}
        style={{ 
          top: 20,
          right: 17 
        }}
        onCancel={() => setIsAddUnitModalOpen(false)}
        width={600}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form form={addUnitForm} onFinish={handleAddUnitSubmit} layout="vertical">
          <Form.Item label="单位名称" name="name"  rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="单位编码" name="code">
            <Input />
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="添加新经历"
        open={isAddExperienceModalOpen}
        getContainer={false}
        style={{ 
          top: 20,
          right: 17 
        }}
        onOk={() => experienceForm.submit()}
        onCancel={() => setIsAddExperienceModalOpen(false)}
        width={600}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form 
          form={experienceForm} 
          onFinish={handleAddExperienceSubmit}
          layout="vertical"
        >
          <Form.Item 
            label="经历名称" 
            name="name" 
            rules={[{ required: true, message: '请输入经历名称' }]}
          >
            <Input  />
          </Form.Item>

          <Form.Item 
            label="开始时间" 
            name="startTime" 
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              showTime 
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
              onChange={(date) => {
                // 当开始时间变化时，清除结束时间
                if (date) {
                  experienceForm.setFieldsValue({ endTime: null });
                }
              }}
            />
          </Form.Item>

          <Form.Item 
            label="结束时间" 
            name="endTime" 
            rules={[
              { required: true, message: '请选择结束时间' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('startTime')) {
                    return Promise.resolve();
                  }
                  if (value.isBefore(getFieldValue('startTime'))) {
                    return Promise.reject('结束时间不能早于开始时间');
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              showTime 
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择结束时间"
              disabledDate={(current) => {
                const startTime = experienceForm.getFieldValue('startTime');
                if (!startTime || !current) return false;
                // 禁用开始时间及之前的日期
                return current.valueOf() <= startTime.valueOf();
              }}
            />
          </Form.Item>

          <Form.Item 
            label="所属用户" 
            name="userId" 
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select 
              placeholder="选择用户"
              loading={queryLoading}
            >
              {queryData?.getAllProfiles?.map((user: UserProfile) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.username} ({user.name || '未命名'})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

            <Form.Item label="地址" name="address">
            <Input  />
          </Form.Item>
        </Form>
      </Modal>

 
      <Modal
        title="编辑经历"
        open={isEditExperienceModalOpen}
        getContainer={false}
        style={{ 
          top: 20,
          right: 17 
        }}
        onOk={() => experienceForm.submit()}
        onCancel={() => setIsEditExperienceModalOpen(false)}
        width={600}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form 
          form={experienceForm} 
          onFinish={handleEditExperienceSubmit}
          layout="vertical"
        >
          <Form.Item 
            label="经历名称" 
            name="name" 
            rules={[{ required: true, message: '请输入经历名称' }]}
          >
            <Input  />
          </Form.Item>

          <Form.Item 
            label="开始时间" 
            name="startTime" 
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              showTime 
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
              onChange={(date) => {
                // 当开始时间变化时，清除结束时间
                if (date) {
                  experienceForm.setFieldsValue({ endTime: null });
                }
              }}
            />
          </Form.Item>

          <Form.Item 
            label="结束时间" 
            name="endTime" 
            rules={[
              { required: true, message: '请选择结束时间' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('startTime')) {
                    return Promise.resolve();
                  }
                  if (value.isBefore(getFieldValue('startTime'))) {
                    return Promise.reject('结束时间不能早于开始时间');
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              showTime 
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择结束时间"
              disabledDate={(current) => {
                const startTime = experienceForm.getFieldValue('startTime');
                if (!startTime || !current) return false;
                // 禁用开始时间及之前的日期
                return current.valueOf() <= startTime.valueOf();
              }}
            />
          </Form.Item>

          <Form.Item 
            label="所属用户" 
            name="userId" 
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select 
              placeholder="选择用户"
              loading={queryLoading}
            >
              {queryData?.getAllProfiles?.map((user: UserProfile) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.username} ({user.name || '未命名'})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
            <Form.Item label="地址" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

 
      <Modal
        title="添加新技能"
        open={isAddSkillModalOpen}
        getContainer={false}
        style={{ 
          top: 20,
          right: 17 
        }}
        onOk={() => addSkillForm.submit()}
        onCancel={() => setIsAddSkillModalOpen(false)}
        width={600}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form 
          form={addSkillForm} 
          onFinish={handleAddSkillSubmit}
          layout="vertical"
        >
          <Form.Item 
            label="技能名称" 
            name="name" 
            rules={[{ required: true, message: '请输入技能名称' }]}
          >
            <Input  />
          </Form.Item>

          <Form.Item 
            label="技能描述" 
            name="description" 
            rules={[{ required: true, message: '请输入技能描述' }]}
          >
            <Input.TextArea rows={4} placeholder="" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑技能"
        open={isEditSkillModalOpen}
        getContainer={false}
        style={{ 
          top: 20,
          right: 17 
        }}
        onOk={() => skillForm.submit()}
        onCancel={() => setIsEditSkillModalOpen(false)}
        width={600}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <Form 
          form={skillForm} 
          onFinish={handleEditSkillSubmit}
          layout="vertical"
        >
          <Form.Item 
            label="技能名称" 
            name="name" 
            rules={[{ required: true, message: '请输入技能名称' }]}
          >
            <Input  />
          </Form.Item>

          <Form.Item 
            label="技能描述" 
            name="description" 
            rules={[{ required: true, message: '请输入技能描述' }]}
          >
            <Input.TextArea rows={4}/>
          </Form.Item>
        </Form>
      </Modal>

 
<Modal
  title="确认删除"
  open={isDeleteModalOpen}
  getContainer={false}
    modalRender={(node) => (
    <div style={{ overflowY: 'auto' }}>{node}</div>
  )}
  style={{ 
    top: 20,
    right: 17 
  }}
  onOk={() => handleDeleteConfirm()}
  onCancel={() => setIsDeleteModalOpen(false)}
  width={400}
  destroyOnClose
  okText="确定"
  cancelText="取消"
>
  <p>{`确定删除${
    deleteType === 'user' ? '用户ID为 ' + deleteId :
    deleteType === 'unit' ? '单位' :
    deleteType === 'experience' ? '经历' : '技能'
  } 的记录吗？`}</p>
</Modal>



<Modal
  open={fileUpload}
  getContainer={false}
  style={{
    top: 200,
    right: 17 
  }}
  onOk={() => handleSubmit()}
  onCancel={() => setfileUpload(false)}
  width={400}
  destroyOnClose
  okText="确定"
  cancelText="取消"
>
<FileExcelOutlined style={{fontSize:30}} />
<div style={{marginTop:20,marginBottom:30}}>上传EXCEL文件</div>
<div className='fileUpload' onClick={() => {
  document.getElementById('file-upload-input')?.click()
}} style={{padding:20,border:'1px solid #ccc',borderRadius:10,margin:'0 20px 20px 20px',cursor:'pointer',  display: fileInformation === 'upload' ? 'block' : 'none'}}>



    <CloudUploadOutlined style={{ fontSize: 80,display:'flex',justifyContent:'center',alignItems:'center', }} />、
<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
<strong>将文件拖拽到此上传</strong>

</div>
<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
  或者，您可以单击此处选择一个文件
</div>

<div  style={{display:'flex',justifyContent:'center',alignItems:'center',color:'blue',cursor:'pointer'}}>
  <strong>点击上传</strong>
</div>

</div>

<div className='fileInformation' onClick={() => {
  setFileInformation('achieve')
}} style={{padding:20,border:'1px solid #ccc',borderRadius:10,margin:'0 20px 20px 20px',cursor:'pointer',  display: fileInformation === 'achieve' ? 'block' : 'none'}}>
  {/* 添加文件信息内容 */}
  {selectedFile && (
    <div style={{textAlign: 'center'}}>
      <p>文件名: {selectedFile.name}</p>
      <p>大小: {formatFileSize(selectedFile.size)}</p>
    </div>
  )}
  {!selectedFile && <p style={{textAlign: 'center'}}>暂无上传文件信息</p>}
</div>
</Modal>

<Modal
  title={`${selectedUserName}的更多技能`}
  open={omitSkills}
  getContainer={false}
  style={{ 
    top: 200,
    left: 17 
  }}
  onCancel={() => handleOmitSkills()}
  width={400}
  destroyOnClose
  footer={null}  // 隐藏底部按钮栏
>
  <Space size={4} wrap>
    {/* 使用slice(3)只展示省略的技能 */}
    {selectedSkills.slice(3).map(skill => (
      <Tag key={skill.id} color={getColorById(skill.id)}>
        {skill.name}
      </Tag>
    ))}
  </Space>
</Modal>




    </div>
  );





};

export default App;

