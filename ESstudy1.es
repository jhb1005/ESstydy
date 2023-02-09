# 데이터 추가(RDB로 따지면 create에 해당)
POST test/_bulk
{"index": {"_id":1}}
{"message":"The quick brown fox"}
{"index": {"_id":2}}
{"message":"The quick brown fox jumps over the lazy dog"}
{"index": {"_id":3}}
{"message":"The quick brown fox jumps over the quick dog"}
{"index": {"_id":4}}
{"message":"Brown fox brown dog"}
{"index": {"_id":5}}
{"message":"Lazy jumping dog"}


#------------------------------------------------------------------------------------------------------------------


# GET 인덱스명/_search: 삽입된 데이터 확인
get test/_search

#------------------------------------------------------------------------------------------------------------------


# match_all: 해당 명령어는 전부 다 출력함(해당 인덱스의 모든 Document검색)
get test/_search
{
  "query":
  {
    "match_all":{}
  }
}

#------------------------------------------------------------------------------------------------------------------


# match: 특정 필드값 안에서 임의의 문장을 검색하는 명령어
# 아래 예제는 message필드에서 dog이라는 문장을 검색한 것이다
get test/_search
{
  "query":
  {
    "match": 
    {
      "message": "dog"
    }
  }
}


#------------------------------------------------------------------------------------------------------------------


# match에서는 공백을 기준으로 단어를 분리함
# 아래 예제에서는 quick 또는 dog을 찾는 문장이다(match에서 여러개의 검색어를 넣게 되면 Default: OR)
# And연산을 하고싶으면 "operator":"and" 문장을 쓰면 된다
get test/_search
{
 "query":
 {
   "match":
   {
     "message":
     {
      "query":"quick dog",
      "operator":"and"
     }
   }
 }
}


#------------------------------------------------------------------------------------------------------------------


# match_phrase: 공백까지 포함해 정확하게 일치하는 내용을 검색하기 위한 명령어
get test/_search
{
  "query":
  {
    "match_phrase": {
      "message": "quick dog"
    }
  }
}


#------------------------------------------------------------------------------------------------------------------


# match_phrase에서 slop이라는 명령어를 이용하여 지정된 값 만큼 단어 사이에 다른 검색어가 끼어드는 것을 허용
# 아래 예시: lazy (1개 허용) dog --> lazy jumping dog
get test/_search
{
  "query":
  {
    "match_phrase":
    {
      "message":
      {
        "query":"lazy dog",
        "slop":"1"
      }
    }
  }
}


#------------------------------------------------------------------------------------------------------------------


# query_string: 연산자를 중심으로 텍스트를 분할하여 쿼리분석
get test/_search
{
  "query":
  {
    "query_string": {
      "default_field": "message",
      "query": "(jumping AND lazy) OR \"quick dog\" "
    }
  }
}


#------------------------------------------------------------------------------------------------------------------


# bool 복합 쿼리: 여러 쿼리를 조합하기 위해서 상위에 bool쿼리를 사용하고, 그 안에 다른쿼리를 넣는 식으로 사용
# must: 쿼리가 참인 Document들을 검색
# must_not: 쿼리가 거짓인 Document들을 검색
# should: 검색결과중 이 쿼리에 해당하는 Document의 점수를 높임
# filter: 쿼리가 참인 Document를 검색하지만 스코어를 계산하지 않음(must보다 검색 속도가 빠름, 캐싱가능)

# must: 쿼리가 참인 Document들을 검색
# quick과 lazy dog가 포함된 모든 문서를 검색
get test/_search
{
  "query":
  {
    "bool": 
    {
      "must": 
      [
        {
          "match": 
          {
            "message": "quick"
          }
        },
        {
          "match_phrase": 
          {
            "message": "lazy dog"
          }
        }
      ]
    }
  }
}

#------------------------------------------------------------------------------------------------------------------


# must_not
# "quick", "lazy dog"이 하나도 포함되지 않은 문서를 검색

get test/_search
{
  "query":
  {
    "bool":
    {
      "must_not": 
      [
        {
          "match": {
            "message": "quick"
          }
        },
        {
          "match_phrase": {
            "message": "lazy dog"
          }
        }
      ]
    }
  }
}


#------------------------------------------------------------------------------------------------------------------

# 기본적인 쿼리만 할줄 알면 됨
