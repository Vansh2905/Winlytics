# test_redis.py
import redis
import os

def test_redis():
    redis_url = "redis://default:gQAAAAAAAX_8AAIgcDFiOTIwMTc1MDM1MmQ0YTVkYTc5OGY4M2JkZjRiZGM3MA@informed-redbird-98300.upstash.io:6379"
    print(f"Testing Upstash Redis...")
    
    try:
        # Test DB 0 (chat app)
        print("\n=== Testing DB 0 (Chat App) ===")
        client0 = redis.Redis.from_url(redis_url, db=0)
        print(f"PING DB0: {client0.ping()}")
        print(f"Keys in DB0: {client0.dbsize()}")
        
        # Test DB 1 (Winlytics)  
        print("\n=== Testing DB 1 (Winlytics) ===")
        client1 = redis.Redis.from_url(redis_url, db=1)
        print(f"PING DB1: {client1.ping()}")
        print(f"Keys in DB1: {client1.dbsize()}")
        
        # Test set/get on DB1
        print(f"\n=== Testing SET/GET on DB1 ===")
        client1.set("test_winlytics", "hello", ex=60)
        value = client1.get("test_winlytics")
        print(f"SET/GET test: {value}")
        
        print("✅ All tests passed!")
        
    except redis.ConnectionError as e:
        print(f"❌ Connection Error: {e}")
    except redis.ResponseError as e:
        print(f"❌ Redis Command Error: {e}")
    except Exception as e:
        print(f"❌ Other Error: {e}")

if __name__ == "__main__":
    test_redis()
